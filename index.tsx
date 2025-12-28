import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Health check endpoint
app.get("/make-server-0b8dc1d2/health", (c) => {
  return c.json({ status: "ok" });
});

// Helper function to generate user ID
const generateUserId = () => crypto.randomUUID();

// Create user with Supabase Auth and store in KV
app.post("/make-server-0b8dc1d2/users", async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, userType, companyRelationship, password } = body;

    console.log(`[CREATE USER] Creating user: ${email} (${userType})`);

    // Validation
    if (!email || !name || !userType || !password) {
      return c.json({ 
        success: false, 
        error: "Missing required fields: email, name, userType, password" 
      }, 400);
    }

    if (!['company', 'advisor', 'admin'].includes(userType)) {
      return c.json({ 
        success: false, 
        error: "Invalid user type. Must be 'company', 'advisor', or 'admin'" 
      }, 400);
    }

    console.log(`[CREATE USER] Creating Supabase Auth user for: ${email}`);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since we don't have email server configured yet
      user_metadata: {
        name,
        user_type: userType,
        company_relationship: companyRelationship,
      },
    });

    if (authError) {
      console.error("[CREATE USER] Auth creation error:", authError);
      return c.json({ 
        success: false, 
        error: `Failed to create auth user: ${authError.message}` 
      }, 400);
    }

    console.log(`[CREATE USER] Auth user created with ID: ${authData.user.id}`);

    // Create user record in KV store
    const userId = generateUserId();
    const userData = {
      id: userId,
      email,
      name,
      user_type: userType,
      company_relationships: companyRelationship ? [companyRelationship] : [],
      invite_status: 'pending',
      auth_user_id: authData.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await kv.set(`user:${userId}`, userData);
      // Also create an email index for quick lookups
      await kv.set(`email:${email.toLowerCase()}`, { userId });
      console.log(`[CREATE USER] User record saved to KV store: ${userId}`);
    } catch (kvError) {
      console.error("[CREATE USER] KV store error:", kvError);
      // Rollback: delete the auth user if KV insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return c.json({ 
        success: false, 
        error: `Failed to create user record: ${kvError instanceof Error ? kvError.message : 'Unknown error'}` 
      }, 500);
    }

    console.log(`[CREATE USER] ✅ User created successfully: ${email}`);

    return c.json({ 
      success: true, 
      user: userData,
      temporaryPassword: password,
    });
  } catch (error) {
    console.error("[CREATE USER] Unexpected error:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Get all users from KV store
app.get("/make-server-0b8dc1d2/users", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    
    // Sort by created_at descending
    users.sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return c.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Delete user from KV store and Auth
app.delete("/make-server-0b8dc1d2/users/:id", async (c) => {
  try {
    const userId = c.req.param("id");

    // Get user from KV store
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    // Delete from KV store
    await kv.del(`user:${userId}`);
    
    // Delete email index
    if (user.email) {
      await kv.del(`email:${user.email.toLowerCase()}`);
    }

    // Delete from Supabase Auth if auth_user_id exists
    if (user.auth_user_id) {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.auth_user_id);
      if (authError) {
        console.error("Error deleting auth user:", authError);
        // Don't fail the request if auth deletion fails
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Add company relationship to existing user
app.post("/make-server-0b8dc1d2/users/:id/add-relationship", async (c) => {
  try {
    const userId = c.req.param("id");
    const body = await c.req.json();
    const { companyRelationship } = body;

    console.log(`[ADD RELATIONSHIP] Adding ${companyRelationship} to user ${userId}`);

    if (!companyRelationship) {
      return c.json({ 
        success: false, 
        error: "Company relationship is required" 
      }, 400);
    }

    // Get user from KV store
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    // Initialize company_relationships array if it doesn't exist (for backwards compatibility)
    if (!user.company_relationships) {
      user.company_relationships = [];
    }

    // Check if relationship already exists
    if (user.company_relationships.includes(companyRelationship)) {
      console.log(`[ADD RELATIONSHIP] Relationship already exists`);
      return c.json({ 
        success: false, 
        error: "This advisor is already associated with this company" 
      }, 400);
    }

    // Add the new relationship
    user.company_relationships.push(companyRelationship);
    user.updated_at = new Date().toISOString();

    // Save back to KV store
    await kv.set(`user:${userId}`, user);

    console.log(`[ADD RELATIONSHIP] ✅ Relationship added successfully`);

    return c.json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error("[ADD RELATIONSHIP] Error:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Login endpoint
app.post("/make-server-0b8dc1d2/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    console.log(`[LOGIN] Attempt for email: ${email}`);

    if (!email || !password) {
      return c.json({ 
        success: false, 
        error: "Email and password are required" 
      }, 400);
    }

    // Check if user exists in KV store first
    const emailIndex = await kv.get(`email:${email.toLowerCase()}`);
    
    if (!emailIndex || !emailIndex.userId) {
      console.error(`[LOGIN] User not found in KV store for email: ${email}`);
      return c.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, 401);
    }

    const userData = await kv.get(`user:${emailIndex.userId}`);
    
    if (!userData) {
      console.error(`[LOGIN] User data missing from KV store for userId: ${emailIndex.userId}`);
      return c.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, 401);
    }

    console.log(`[LOGIN] User found in KV: ${userData.name} (${userData.user_type}), auth_user_id: ${userData.auth_user_id}`);

    // Create a client-side Supabase instance for auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(`[LOGIN] Auth error for ${email}:`, error.message, error.status, error.code);
      console.error(`[LOGIN] Full error:`, JSON.stringify(error, null, 2));
      return c.json({ 
        success: false, 
        error: "Invalid email or password. Please check your credentials or reset your password." 
      }, 401);
    }

    console.log(`[LOGIN] Success for ${email}`);

    return c.json({ 
      success: true, 
      session: data.session,
      user: userData,
    });
  } catch (error) {
    console.error("[LOGIN] Unexpected error:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Send invitation email
app.post("/make-server-0b8dc1d2/send-invite", async (c) => {
  try {
    const body = await c.req.json();
    const { recipientEmail, recipientName, companyRelationship, userType, temporaryPassword, customSubject, customBody } = body;

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    // For now, we'll log the email details
    console.log("\n📧 ============ INVITATION EMAIL ============");
    console.log("To:", recipientEmail);
    console.log("Name:", recipientName);
    console.log("Company:", companyRelationship);
    console.log("Type:", userType);
    console.log("Temporary Password:", temporaryPassword);
    console.log("Login URL:", `${Deno.env.get("SUPABASE_URL")}/login`);
    
    if (customSubject || customBody) {
      console.log("\n--- CUSTOM EMAIL CONTENT ---");
      if (customSubject) console.log("Subject:", customSubject);
      if (customBody) console.log("Body:\n", customBody);
    }
    
    console.log("==========================================\n");

    // TODO: Replace with actual email service integration
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY'));
    // await sgMail.send({
    //   to: recipientEmail,
    //   from: 'noreply@ethiq.com',
    //   subject: customSubject || `${companyRelationship} invited you to EthIQ Board`,
    //   html: customBody || defaultEmailTemplate,
    // });

    return c.json({ 
      success: true, 
      message: "Invitation email sent (logged to console in development)" 
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Update password
app.post("/make-server-0b8dc1d2/auth/update-password", async (c) => {
  try {
    const body = await c.req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return c.json({ 
        success: false, 
        error: "Email and new password are required" 
      }, 400);
    }

    // Get user from KV store using email index
    const emailIndex = await kv.get(`email:${email.toLowerCase()}`);
    
    if (!emailIndex || !emailIndex.userId) {
      return c.json({ 
        success: false, 
        error: "User not found" 
      }, 404);
    }

    const userData = await kv.get(`user:${emailIndex.userId}`);
    
    if (!userData || !userData.auth_user_id) {
      return c.json({ 
        success: false, 
        error: "User not found" 
      }, 404);
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userData.auth_user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return c.json({ 
        success: false, 
        error: updateError.message 
      }, 500);
    }

    return c.json({ 
      success: true, 
      message: "Password updated successfully" 
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Get user counts and statistics
app.get("/make-server-0b8dc1d2/users/stats", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");

    const stats = {
      total: users.length,
      companies: users.filter((u: any) => u.user_type === 'company').length,
      advisors: users.filter((u: any) => u.user_type === 'advisor').length,
      admins: users.filter((u: any) => u.user_type === 'admin').length,
    };

    return c.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Debug endpoint to check user existence
app.get("/make-server-0b8dc1d2/debug/user/:email", async (c) => {
  try {
    const email = c.req.param("email");
    
    // Check KV store
    const emailIndex = await kv.get(`email:${email.toLowerCase()}`);
    const userData = emailIndex ? await kv.get(`user:${emailIndex.userId}`) : null;
    
    // Check Supabase Auth
    let authUser = null;
    if (userData?.auth_user_id) {
      try {
        const { data, error } = await supabaseAdmin.auth.admin.getUserById(userData.auth_user_id);
        authUser = error ? { error: error.message } : { id: data.user.id, email: data.user.email };
      } catch (e) {
        authUser = { error: e instanceof Error ? e.message : 'Unknown error' };
      }
    }
    
    return c.json({
      email,
      kvStore: {
        found: !!userData,
        userId: userData?.id,
        authUserId: userData?.auth_user_id,
      },
      supabaseAuth: authUser,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// Initialize database - for KV store, this is a no-op but we keep it for compatibility
app.post("/make-server-0b8dc1d2/init-db", async (c) => {
  try {
    // KV store is already set up by Figma Make
    // No initialization needed
    console.log("Database ready - using KV store");
    
    return c.json({ 
      success: true, 
      message: "Database ready (using KV store)" 
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

// ==================== ADVISOR APPLICATIONS ====================

// Submit advisor application
app.post("/make-server-0b8dc1d2/advisor-applications", async (c) => {
  try {
    const body = await c.req.json();
    const {
      name,
      email,
      role,
      executive_type,
      years_experience,
      interests,
      special_domains,
      bio,
      linkedin_url,
      profile_visibility,
    } = body;

    console.log(`[ADVISOR APPLICATION] New application from: ${email}`);

    // Validation
    if (!name || !email || !executive_type || !years_experience || !interests || !bio) {
      return c.json({
        success: false,
        error: "Missing required fields",
      }, 400);
    }

    // Check if email already has an application
    const existingApplications = await kv.getByPrefix("advisor_application:");
    const duplicateApp = existingApplications.find(
      (app: any) => app.email === email && app.status === 'Pending'
    );

    if (duplicateApp) {
      return c.json({
        success: false,
        error: "An application with this email is already pending review",
      }, 400);
    }

    const applicationId = generateUserId();
    const application = {
      id: applicationId,
      name,
      email,
      role: role || '',
      executive_type,
      years_experience,
      interests,
      special_domains: special_domains || [],
      bio,
      linkedin_url: linkedin_url || '',
      profile_visibility: profile_visibility ?? true,
      status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(`advisor_application:${applicationId}`, application);

    console.log(`[ADVISOR APPLICATION] ✅ Application submitted: ${applicationId}`);

    return c.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("[ADVISOR APPLICATION] Error:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});

// Get all advisor applications (Admin only)
app.get("/make-server-0b8dc1d2/advisor-applications", async (c) => {
  try {
    console.log(`[GET APPLICATIONS] Fetching all advisor applications`);

    const applications = await kv.getByPrefix("advisor_application:");

    console.log(`[GET APPLICATIONS] ✅ Found ${applications.length} applications`);

    return c.json({
      success: true,
      applications: applications.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    });
  } catch (error) {
    console.error("[GET APPLICATIONS] Error:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});

// Update application status (Approve/Deny)
app.put("/make-server-0b8dc1d2/advisor-applications/:id", async (c) => {
  try {
    const applicationId = c.req.param("id");
    const body = await c.req.json();
    const { status, reviewed_by } = body;

    console.log(`[UPDATE APPLICATION] Updating application ${applicationId} to status: ${status}`);

    if (!status || !['Approved', 'Denied'].includes(status)) {
      return c.json({
        success: false,
        error: "Invalid status. Must be 'Approved' or 'Denied'",
      }, 400);
    }

    const application = await kv.get(`advisor_application:${applicationId}`);

    if (!application) {
      return c.json({
        success: false,
        error: "Application not found",
      }, 404);
    }

    application.status = status;
    application.reviewed_by = reviewed_by;
    application.reviewed_at = new Date().toISOString();
    application.updated_at = new Date().toISOString();

    await kv.set(`advisor_application:${applicationId}`, application);

    console.log(`[UPDATE APPLICATION] ✅ Application ${status.toLowerCase()}`);

    return c.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("[UPDATE APPLICATION] Error:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});

Deno.serve(app.fetch);
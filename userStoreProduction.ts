// Production UserStore with Supabase backend
import { projectId, publicAnonKey } from './supabase/info';

export interface User {
  id: string;
  email: string;
  type: 'company' | 'advisor' | 'admin';
  name: string;
  password?: string; // Only used temporarily during creation
  createdAt: string;
  companyRelationship?: string; // Legacy - for backwards compatibility
  companyRelationships?: string[]; // New field - array of company relationships
  inviteStatus?: 'pending' | 'accepted';
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0b8dc1d2`;

export class UserStore {
  /**
   * Initialize the database (create tables)
   * Call this once when the app first loads
   */
  static async initDatabase(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/init-db`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error initializing database:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get all users from the database
   */
  static async getUsers(): Promise<User[]> {
    try {
      console.log('[UserStore] Fetching users from:', `${API_BASE}/users`);
      
      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('[UserStore] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[UserStore] Response not OK:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('[UserStore] Response data:', data);
      
      if (!data.success) {
        console.error('Error fetching users:', data.error);
        throw new Error(data.error || 'Failed to fetch users');
      }

      // Map database fields to our User interface
      return data.users.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        type: u.user_type,
        companyRelationship: u.company_relationship, // Legacy field
        companyRelationships: u.company_relationships || [], // Array of relationships
        inviteStatus: u.invite_status,
        createdAt: u.created_at,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Re-throw to let caller handle it
    }
  }

  /**
   * Add a new user
   */
  static async addUser(
    user: Omit<User, 'id' | 'createdAt'> & { password: string }
  ): Promise<{ success: boolean; user?: User; error?: string; temporaryPassword?: string }> {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          userType: user.type,
          companyRelationship: user.companyRelationship,
          companyRelationships: user.companyRelationships,
          password: user.password,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Error adding user:', data.error);
        return { success: false, error: data.error };
      }

      // Map database fields to our User interface
      const newUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        type: data.user.user_type,
        companyRelationship: data.user.company_relationship,
        companyRelationships: data.user.company_relationships,
        inviteStatus: data.user.invite_status,
        createdAt: data.user.created_at,
      };

      return { 
        success: true, 
        user: newUser,
        temporaryPassword: data.temporaryPassword,
      };
    } catch (error) {
      console.error('Error adding user:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Delete a user
   */
  static async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Authenticate user by email and password
   */
  static async authenticate(
    email: string, 
    password: string
  ): Promise<{ success: boolean; user?: User; error?: string; session?: any }> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!data.success) {
        return { success: false, error: data.error };
      }

      // Map database fields to our User interface
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        type: data.user.user_type,
        companyRelationship: data.user.company_relationship,
        companyRelationships: data.user.company_relationships,
        inviteStatus: data.user.invite_status,
        createdAt: data.user.created_at,
      };

      return { 
        success: true, 
        user,
        session: data.session,
      };
    } catch (error) {
      console.error('Error authenticating:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      return users.some(u => u.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(
    email: string, 
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/auth/update-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating password:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update user
   */
  static async updateUser(
    userId: string, 
    updates: Partial<User>
  ): Promise<{ success: boolean; error?: string }> {
    // TODO: Implement update endpoint in backend if needed
    console.warn('updateUser not yet implemented');
    return { success: false, error: 'Not implemented' };
  }

  /**
   * Get counts by type
   */
  static async getCounts(): Promise<{
    total: number;
    companies: number;
    advisors: number;
    admins: number;
  }> {
    try {
      const response = await fetch(`${API_BASE}/users/stats`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching stats:', data.error);
        return { total: 0, companies: 0, advisors: 0, admins: 0 };
      }

      return data.stats;
    } catch (error) {
      console.error('Error fetching counts:', error);
      return { total: 0, companies: 0, advisors: 0, admins: 0 };
    }
  }

  /**
   * Send invitation email
   */
  static async sendInviteEmail(params: {
    recipientEmail: string;
    recipientName: string;
    companyRelationship: string;
    userType: string;
    temporaryPassword: string;
    customSubject?: string;
    customBody?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/send-invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending invite:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Add a company relationship to an existing user
   */
  static async addCompanyRelationship(
    userId: string,
    companyRelationship: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/add-relationship`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyRelationship }),
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Error adding relationship:', data.error);
        return { success: false, error: data.error };
      }

      // Map database fields to our User interface
      const updatedUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        type: data.user.user_type,
        companyRelationship: data.user.company_relationship,
        companyRelationships: data.user.company_relationships,
        inviteStatus: data.user.invite_status,
        createdAt: data.user.created_at,
      };

      return { 
        success: true, 
        user: updatedUser,
      };
    } catch (error) {
      console.error('Error adding relationship:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
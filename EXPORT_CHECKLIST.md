# 📋 Export Checklist - Figma Make to Production

## 🔍 Pre-Export Verification

Your Ethiq app is **99% portable**! There's only ONE thing to fix when exporting.

---

## ⚠️ Logo Image Import (IMPORTANT)

### **Current State (Figma Make)**
These files use a Figma-specific import:
```typescript
import logo from 'figma:asset/5dd1ff4a515da9309007d8a15991249862fadeea.png';
```

**Files affected:**
- `/components/Sidebar.tsx`
- `/components/Landing.tsx`
- `/components/LoginPage.tsx`
- `/components/AdminPanel.tsx`
- `/components/LearnMore.tsx`
- `/components/LearnMoreAdvisor.tsx`
- `/components/FirstTimeSetup.tsx`
- `/components/advisor/AdvisorOnboarding.tsx`

### **How to Fix (2 options)**

#### **Option 1: Replace with your actual logo** ⭐ (Recommended)

1. **Export the logo from Figma Make**:
   - Look for the asset file `5dd1ff4a515da9309007d8a15991249862fadeea.png`
   - Save it as `ethiq-logo.png`

2. **Add to your project**:
   ```
   src/
   └── assets/
       └── ethiq-logo.png
   ```

3. **Update all imports** (in all 8 files listed above):
   ```typescript
   // OLD (Figma Make)
   import logo from 'figma:asset/5dd1ff4a515da9309007d8a15991249862fadeea.png';
   
   // NEW (Production)
   import logo from '../assets/ethiq-logo.png';
   ```

   For files in subdirectories like `advisor/AdvisorOnboarding.tsx`:
   ```typescript
   import logo from '../../assets/ethiq-logo.png';
   ```

#### **Option 2: Use a placeholder** (Quick fix)

Create a simple SVG logo component:

**`src/components/Logo.tsx`**:
```typescript
export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#163BB5"/>
      <text x="50" y="28" fontSize="24" fontWeight="bold" fill="#163BB5">Ethiq</text>
    </svg>
  );
}
```

Then replace logo imports:
```typescript
// Remove this
import logo from 'figma:asset/5dd1ff4a515da9309007d8a15991249862fadeea.png';

// Add this
import { Logo } from './Logo';

// Replace <img> tags
// OLD:
<img src={logo} alt="Ethiq" className="h-8 w-auto" />

// NEW:
<Logo className="h-8 w-auto" />
```

---

## ✅ Everything Else is Production-Ready

### **No Changes Needed For:**
- ✅ All React components
- ✅ Supabase integration  
- ✅ API calls
- ✅ Authentication
- ✅ State management
- ✅ Routing logic
- ✅ UI components
- ✅ Backend Edge Functions
- ✅ Database operations

### **Standard Dependencies (All Compatible)**
```json
{
  "@supabase/supabase-js": "Standard npm package ✅",
  "react": "Standard npm package ✅",
  "react-dom": "Standard npm package ✅",
  "lucide-react": "Standard npm package ✅",
  "recharts": "Standard npm package ✅",
  "sonner": "Standard npm package ✅"
}
```

---

## 🚀 Quick Export Steps

### **1. Download from Figma Make**
- Click Export/Download button
- Extract the ZIP file

### **2. Fix the Logo**
Choose Option 1 or Option 2 above and update 8 files

### **3. Add Build Configuration**
Copy the config files from `DEPLOYMENT_GUIDE.md`:
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.tsx`

### **4. Install & Test**
```bash
npm install
npm run dev
```

### **5. Deploy**
```bash
vercel
```

**Done! 🎉**

---

## 📝 Full File List to Export

```
Your Ethiq Project/
│
├── Configuration Files (create new)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── index.html
│
└── src/ (from Figma Make + logo fix)
    ├── main.tsx (create new)
    ├── App.tsx ✅
    │
    ├── assets/ (NEW)
    │   └── ethiq-logo.png (export from Figma Make)
    │
    ├── components/ ✅
    │   ├── AdminApp.tsx
    │   ├── AdminPanel.tsx (fix logo import)
    │   ├── AdvisorApp.tsx
    │   ├── CompanyApp.tsx
    │   ├── DiagnosticPage.tsx
    │   ├── EmailPreviewModal.tsx
    │   ├── FirstTimeSetup.tsx (fix logo import)
    │   ├── JoinUs.tsx
    │   ├── Landing.tsx (fix logo import)
    │   ├── Layout.tsx
    │   ├── LearnMore.tsx (fix logo import)
    │   ├── LearnMoreAdvisor.tsx (fix logo import)
    │   ├── LoginPage.tsx (fix logo import)
    │   ├── Sidebar.tsx (fix logo import)
    │   │
    │   ├── admin/
    │   │   ├── AdminApplications.tsx
    │   │   └── AdminUsers.tsx
    │   │
    │   ├── advisor/
    │   │   ├── AdvisorCompanies.tsx
    │   │   ├── AdvisorContacts.tsx
    │   │   ├── AdvisorEngagement.tsx
    │   │   ├── AdvisorHandshakes.tsx
    │   │   ├── AdvisorHome.tsx
    │   │   ├── AdvisorNudges.tsx
    │   │   ├── AdvisorOnboarding.tsx (fix logo import)
    │   │   └── AdvisorProfileEdit.tsx
    │   │
    │   ├── company/
    │   │   ├── AdvisorProfile.tsx
    │   │   ├── CompanyHandshakes.tsx
    │   │   ├── CompanyHome.tsx
    │   │   ├── CompanyNudges.tsx
    │   │   ├── CreateNudge.tsx
    │   │   ├── Directory.tsx
    │   │   ├── InviteAdvisor.tsx
    │   │   ├── MyAdvisors.tsx
    │   │   ├── ProposeHandshake.tsx
    │   │   ├── Relationships.tsx
    │   │   ├── SelectAdvisorForNudge.tsx
    │   │   └── SendContact.tsx
    │   │
    │   ├── figma/
    │   │   └── ImageWithFallback.tsx ✅
    │   │
    │   └── ui/
    │       └── (all files) ✅
    │
    ├── data/ ✅
    │   └── mockData.ts
    │
    ├── styles/ ✅
    │   └── globals.css
    │
    ├── supabase/ ✅ (already deployed, but include for reference)
    │   └── functions/
    │       └── server/
    │           ├── index.tsx
    │           └── kv_store.tsx
    │
    └── utils/ ✅
        ├── csvParser.ts
        ├── emailService.ts
        ├── userStore.ts
        ├── userStoreProduction.ts
        └── supabase/
            ├── client.ts
            └── info.tsx
```

---

## 🎯 Total Changes Required

**Files to create:** 6 config files + 1 main.tsx  
**Files to modify:** 8 files (logo imports only)  
**Files to copy as-is:** Everything else (100+ files)

**Estimated time:** 15-30 minutes

---

## 🔍 Post-Export Validation

After fixing the logo imports, verify:

```bash
# Install dependencies
npm install

# Check for TypeScript errors
npm run build

# Should see: "✓ built in XXXms"
```

If build succeeds → **You're ready to deploy!** 🚀

---

## 💡 Pro Tips

### **Tip 1: Use Find & Replace**
In VS Code or your editor:
1. Find: `import logo from 'figma:asset/5dd1ff4a515da9309007d8a15991249862fadeea.png';`
2. Replace: `import logo from '../assets/ethiq-logo.png';`
3. Manually adjust `../` vs `../../` based on file depth

### **Tip 2: Test Before Deploy**
Always run `npm run dev` locally and test:
- Login flow ✓
- Create user ✓
- Admin panel ✓
- All navigation ✓

### **Tip 3: Keep Figma Make Project**
Don't delete your Figma Make project! Use it for:
- Quick prototyping new features
- Testing before production deployment
- Backup reference

---

## ✅ Ready to Export?

**Checklist:**
- [ ] Read DEPLOYMENT_GUIDE.md
- [ ] Understand the logo import fix
- [ ] Have your Ethiq logo ready (or use placeholder)
- [ ] Know which deployment platform to use (Vercel recommended)
- [ ] Supabase project is working (it already is!)

**Once ready, it's just:**
1. Export from Figma Make
2. Fix 8 logo imports (5 min)
3. Add config files (5 min)
4. Test locally (5 min)
5. Deploy to Vercel (2 min)

**Total time: ~20 minutes from export to live!** ⚡

---

**🎊 You're all set! Your Ethiq platform is ready for the real world!**

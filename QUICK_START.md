# ⚡ Quick Start - Deploy Ethiq in 20 Minutes

## 🎯 Goal
Go from Figma Make → Live Production URL in 20 minutes

---

## ✅ Prerequisites

- [ ] Ethiq app working in Figma Make
- [ ] Logo exported from Figma Make (save as `ethiq-logo.png`)
- [ ] Node.js installed (download at nodejs.org)
- [ ] Vercel account (sign up free at vercel.com)

---

## 📦 Step 1: Export (5 min)

### Download from Figma Make
1. Click Export/Download button
2. Extract ZIP to folder: `ethiq-production/`

### Add Logo
1. Create `ethiq-production/src/assets/` folder
2. Copy your `ethiq-logo.png` into it

---

## 🔧 Step 2: Fix Logo Imports (5 min)

Open these 8 files and replace the logo import:

**Files to update:**
```
src/components/Sidebar.tsx
src/components/Landing.tsx  
src/components/LoginPage.tsx
src/components/AdminPanel.tsx
src/components/LearnMore.tsx
src/components/LearnMoreAdvisor.tsx
src/components/FirstTimeSetup.tsx
src/components/advisor/AdvisorOnboarding.tsx
```

**Find this line:**
```typescript
import logo from 'figma:asset/5dd1ff4a515da9309007d8a15991249862fadeea.png';
```

**Replace with:**
```typescript
// For files in /components/
import logo from '../assets/ethiq-logo.png';

// For files in /components/advisor/
import logo from '../../assets/ethiq-logo.png';
```

**Pro tip:** Use Find & Replace in your code editor!

---

## ⚙️ Step 3: Add Config Files (5 min)

Create these files in your `ethiq-production/` root:

### **package.json**
```json
{
  "name": "ethiq",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.263.1",
    "recharts": "^2.5.0",
    "sonner": "^1.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### **vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

### **index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ethiq - B2B Workflow Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### **src/main.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 🧪 Step 4: Test Locally (3 min)

Open terminal in `ethiq-production/`:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open browser to: `http://localhost:5173`

**Test:**
- ✅ Page loads without errors
- ✅ Logo appears correctly
- ✅ Can navigate to login page
- ✅ No console errors

If everything works → Continue to deployment!

---

## 🚀 Step 5: Deploy to Vercel (2 min)

### Option A: Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts)
vercel

# When asked:
# - Project name: ethiq
# - Directory: .
# - Override settings: N
```

### Option B: Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from Git or drag & drop folder
4. Click "Deploy"

**Done! You'll get a URL like:** `https://ethiq.vercel.app`

---

## ✅ Step 6: Verify (2 min)

Test your production URL:

- [ ] Landing page loads
- [ ] Logo displays correctly
- [ ] Can click "Log In"
- [ ] Can access "Join Us" page
- [ ] No console errors

**If everything works → You're LIVE! 🎉**

---

## 🌐 Optional: Add Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `app.ethiq.com`)
3. Update DNS records (Vercel shows instructions)
4. SSL certificate auto-generated!

---

## 📊 What You Just Deployed

**Frontend:**
- ✅ Hosted on Vercel's global CDN
- ✅ Automatic HTTPS
- ✅ 99.99% uptime
- ✅ Free tier (100GB bandwidth/month)

**Backend:**
- ✅ Already live on Supabase
- ✅ No changes needed
- ✅ All data preserved
- ✅ All API endpoints working

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check for TypeScript errors
npm run build

# Common fix: reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Logo Not Showing
- Check file path: `src/assets/ethiq-logo.png` exists
- Verify imports use correct relative path
- Clear browser cache

### API Errors (Failed to Fetch)
- ✅ Your backend is already deployed on Supabase
- ✅ No changes needed - API URL is hardcoded correctly
- Check browser console for exact error
- Run diagnostic page: Click "Run Diagnostics" if error appears

### Styles Broken
- Ensure `import './styles/globals.css';` is in `src/main.tsx`
- Check `styles/globals.css` exists in `src/` folder

---

## 📝 Folder Structure (Final)

```
ethiq-production/
├── package.json          ← Created
├── vite.config.ts        ← Created
├── tsconfig.json         ← Created
├── index.html            ← Created
│
└── src/
    ├── main.tsx          ← Created
    ├── App.tsx           ← From Figma Make
    │
    ├── assets/           ← Created
    │   └── ethiq-logo.png
    │
    ├── components/       ← From Figma Make
    ├── utils/            ← From Figma Make
    ├── supabase/         ← From Figma Make
    ├── styles/           ← From Figma Make
    └── data/             ← From Figma Make
```

---

## 🎯 What's Next?

### **Now (You're Live!)**
- Share production URL with team
- Create first admin account
- Add test users
- Test all workflows

### **This Week**
- Set up custom domain
- Configure email service for invitations
- Add Google Analytics (optional)
- Invite beta users

### **This Month**
- Gather feedback
- Iterate on features
- Consider Vercel Pro if needed ($20/mo)
- Monitor usage and costs

---

## 💰 Current Costs

**Total: $0/month**

- Vercel (Free): ✅ Covers your traffic
- Supabase (Free): ✅ Covers your data

**Upgrade when:**
- Database > 500MB (Supabase Pro: $25/mo)
- Bandwidth > 100GB/mo (Vercel Pro: $20/mo)
- Need priority support

---

## 🎉 Congratulations!

You just deployed a production SaaS application with:
- ✅ Global CDN delivery
- ✅ Automatic SSL
- ✅ Production database
- ✅ Enterprise authentication
- ✅ Scalable architecture
- ✅ Professional UI

**Your Ethiq platform is now live and ready for customers!**

---

## 📚 Learn More

- **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **PHASE_2_READY.md** - Complete production readiness overview
- **EXPORT_CHECKLIST.md** - Pre-deployment checklist
- **PRODUCTION_READY.md** - Backend & Supabase setup

---

**Questions? Issues? Check the troubleshooting section above!**

**Happy launching! 🚀**

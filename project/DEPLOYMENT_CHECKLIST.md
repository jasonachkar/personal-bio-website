# Netlify Deployment Checklist

## Pre-Deployment (Complete Before Push)

### ✅ Code Changes
- [x] Added `critters` package to package.json
- [x] Fixed netlify.toml configuration
- [x] Fixed TypeScript type assertion in auth.ts
- [x] Installed dependencies (`npm install`)
- [x] Local build passes (`npm run build`)

### ✅ Environment Variables (.env)
Ensure your local `.env` file has:
```bash
JWT_SECRET=<your-32-char-secret>
ADMIN_PASSWORD_HASH=<bcrypt-hash>
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=<optional>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<optional>
```

### 📋 Netlify Dashboard Setup

#### 1. Environment Variables
Go to: `Site settings > Environment variables`

Add these variables:
- [ ] `JWT_SECRET` - Minimum 32 characters (generate with: `openssl rand -base64 32`)
- [ ] `ADMIN_PASSWORD_HASH` - Bcrypt hash (generate with: `node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"`)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - (Optional) Your Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - (Optional) Your Supabase anon key

#### 2. Build Settings
Verify in: `Site settings > Build & deploy > Build settings`

- [ ] **Base directory**: `project`
- [ ] **Build command**: `npm run build`
- [ ] **Publish directory**: `.next`
- [ ] **Node version**: 20 (set in `Site settings > Environment > Node version`)

#### 3. Functions (Optional)
If using Netlify Functions:
- [ ] **Functions directory**: `netlify/functions`

---

## Deployment Steps

### 1. Push to Git Repository
```bash
git add .
git commit -m "Fix: Netlify build configuration and missing dependencies"
git push origin main
```

### 2. Trigger Deploy
Netlify will automatically deploy when you push to your connected branch.

Or manually trigger:
- Go to Netlify dashboard > Deploys
- Click "Trigger deploy" > "Deploy site"

### 3. Monitor Build
Watch the build logs in real-time:
- Click on the deploying build
- Monitor each phase:
  1. ✅ Install dependencies
  2. ✅ Build
  3. ✅ Deploy

Expected build time: **45-90 seconds**

---

## Post-Deployment Verification

### 1. Site Loads
- [ ] Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
- [ ] Homepage loads without errors
- [ ] No console errors (F12 > Console)

### 2. Demo Pages Work
Test each showcase page:
- [ ] `/siem` - SIEM Detection Console
  - Shows 30 events
  - Shows 5 rules
  - Search works
  - Stats display correctly

- [ ] `/azure-blueprint` - Azure Security Blueprint
  - Shows 16 components
  - Security Checklist shows 15 controls
  - Component details display

- [ ] `/threat-modeling` - Threat Modeling Playground
  - Template loads
  - Shows 6 components
  - Shows 10 threats

- [ ] `/devsecops` - DevSecOps Pipeline
  - Scan results display
  - Gates show correctly

### 3. API Routes Work
Test API endpoints:
```bash
# Replace with your Netlify URL
SITE_URL="https://your-site.netlify.app"

curl $SITE_URL/api/siem/events | jq '.data.events | length'
# Should return: 30

curl $SITE_URL/api/azure | jq '.data.architecture.components | length'
# Should return: 16

curl $SITE_URL/api/threat-models | jq '.data.template.name'
# Should return: "Web Application (3-Tier Architecture)"
```

### 4. Admin Authentication (If Implemented)
- [ ] Can access admin login page
- [ ] Login works with credentials
- [ ] Protected routes require authentication
- [ ] Logout works

### 5. Performance Check
- [ ] Lighthouse score (aim for 90+)
  - Open Chrome DevTools
  - Go to Lighthouse tab
  - Run audit
- [ ] Page load time <3 seconds
- [ ] Images load correctly
- [ ] Fonts load without flash

### 6. Mobile Check
- [ ] Site loads on mobile
- [ ] Navigation works
- [ ] Demo pages are responsive
- [ ] No horizontal scroll

---

## Common Issues & Solutions

### Issue: Build Fails with "Cannot find module"
**Solution**:
```bash
# Locally run:
npm install
npm run build

# If passes, commit and push package-lock.json
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Issue: Site Loads but Shows Blank Page
**Check**:
1. Browser console for errors (F12)
2. Netlify environment variables are set
3. API routes return data (test with curl)

### Issue: Environment Variables Not Working
**Fix**:
1. Verify variables are set in Netlify dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy site after adding variables

### Issue: Images Not Loading
**Fix**:
1. Check image domains in `next.config.js`
2. Verify images exist in project
3. Check browser console for errors

---

## Rollback Plan

If deployment has issues:

### Option 1: Quick Rollback (Netlify Dashboard)
1. Go to Deploys tab
2. Find last working deployment
3. Click "Publish deploy"

### Option 2: Git Revert
```bash
git revert HEAD
git push origin main
```

### Option 3: Disable Auto-Deploy
1. Go to `Site settings > Build & deploy`
2. Click "Stop auto publishing"
3. Fix issues locally
4. Re-enable when ready

---

## Performance Monitoring

### Netlify Analytics (If Enabled)
Monitor:
- [ ] Page views
- [ ] Load times
- [ ] 404 errors
- [ ] Bandwidth usage

### Error Monitoring
Check Netlify Functions logs for:
- API errors
- Server errors
- Authentication failures

---

## Security Verification

### Environment Variables
- [ ] No secrets in git repository
- [ ] JWT_SECRET is 32+ characters
- [ ] Admin password is strong
- [ ] Supabase keys use anon key (not service role)

### Security Headers
Test with: https://securityheaders.com
Should have:
- [ ] Content-Security-Policy
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] Strict-Transport-Security

### SSL Certificate
- [ ] HTTPS enabled (automatic with Netlify)
- [ ] No mixed content warnings
- [ ] Certificate valid

---

## Optimization Checklist

### Before Going Live
- [ ] Update site name in Netlify
- [ ] Set custom domain (optional)
- [ ] Enable Netlify Analytics (optional)
- [ ] Set up form handling (optional)
- [ ] Configure redirects (if needed)

### SEO
- [ ] Update meta tags in pages
- [ ] Add robots.txt
- [ ] Add sitemap.xml
- [ ] Verify social media previews

---

## Success Criteria

✅ Build passes on Netlify
✅ All pages load without errors
✅ All demo features work correctly
✅ API endpoints return data
✅ Performance score >90
✅ Mobile responsive
✅ No console errors
✅ Security headers present

---

## Need Help?

### Documentation
- [Netlify Next.js Docs](https://docs.netlify.com/frameworks/next-js/overview/)
- [NETLIFY_BUILD_FIXES_COMPLETE.md](./NETLIFY_BUILD_FIXES_COMPLETE.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)

### Netlify Support
- Check build logs in dashboard
- Review Deploy log tab for errors
- Check Functions log tab for API errors

---

**Ready to Deploy!** 🚀

Once all pre-deployment items are checked, push your code and Netlify will handle the rest.

**Estimated deployment time**: 1-2 minutes

---

**Last Updated**: December 29, 2025
**Status**: ✅ Ready for Production

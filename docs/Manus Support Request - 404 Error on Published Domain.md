# Manus Support Request - 404 Error on Published Domain

**Date:** December 7, 2024  
**Request Type:** Deployment Issue - 404 Error on Published Domain

---

## Issue Summary

My published website is returning 404 errors on both the manus.space subdomain and custom domain, despite the development server working perfectly and the site showing as "published" in the Management UI.

---

## Project Details

- **Project Name:** sr17018-website
- **Project Display Name:** SR17018 Research Compound / WDBC Distribution
- **Current Checkpoint Version:** db3f97a8
- **Features Enabled:** server, db, user

---

## Affected URLs

1. **Manus Subdomain:** https://BSRInnovations.manus.space
   - **Error:** "This page cannot be found (404)"
   
2. **Custom Domain:** https://bsrinnovations.com
   - **Error:** "Error 404 - Unknown hostname. The requested domain could not be served at this time."
   - **Request ID:** 9e2bd2a5-d4d4-4977-b40e-ecb66bf9007e

3. **Development URL (WORKING):** https://3000-igbajqvjurvu52l0e399l-49af6ea5.manusvm.computer
   - This URL loads the site correctly with all functionality working

---

## What Works

✅ Development server runs without errors  
✅ All routes load correctly in development  
✅ TypeScript compilation successful (0 errors)  
✅ Production build completes successfully  
✅ Local production build test serves pages correctly  
✅ Site shows as "Published" in Management UI  

---

## What Doesn't Work

❌ Published manus.space subdomain returns 404  
❌ Custom domain returns "Unknown hostname" error  
❌ All routes on published domain inaccessible  

---

## Steps Taken to Resolve

1. ✅ Fixed production static file path resolution in `server/_core/vite.ts`
2. ✅ Rebuilt project using `pnpm build` - build completed successfully
3. ✅ Tested production build locally on port 3001 - works correctly
4. ✅ Created new checkpoint (db3f97a8) with fixes
5. ✅ Clicked "Publish" button in Management UI multiple times
6. ✅ Waited for deployment propagation (5+ minutes)
7. ✅ Tested in incognito mode / cleared browser cache
8. ❌ Issue persists - 404 errors continue

---

## Technical Details

### Build Configuration

**package.json scripts:**
```json
{
  "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js"
}
```

**Build output structure:**
```
dist/
├── index.js (server bundle - 60.7kb)
└── public/
    ├── index.html (367.94 kB)
    ├── wdbc-logo.png
    └── assets/
        ├── index-jdq7oMnD.css (123.67 kB)
        └── index-B2Sjk0TB.js (996.83 kB)
```

### Production Server Test Results

```bash
$ NODE_ENV=production PORT=3001 node dist/index.js
[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3001/

$ curl http://localhost:3001/
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>SR17018 Research Compound</title>
    <script type="module" crossorigin src="/assets/index-B2Sjk0TB.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-jdq7oMnD.css">
  </head>
  ...
```

**Result:** ✅ Production build serves correctly locally

---

## Suspected Issue

The Manus deployment platform may not be:
1. Picking up the latest checkpoint build (db3f97a8)
2. Running the build process correctly during deployment
3. Serving the built static files from the correct directory
4. Recognizing the domain binding for BSRInnovations.manus.space

---

## Request

Please investigate why the published domain is not serving the application despite:
- Successful local production build
- "Published" status in Management UI  
- Multiple republish attempts
- Correct build configuration

**Specific questions:**
1. Is the deployment using checkpoint db3f97a8?
2. Are there any build errors in the deployment logs?
3. Is the domain BSRInnovations.manus.space properly bound to this project?
4. Can you manually trigger a fresh build and deployment?

---

## Additional Context

- This is a full-stack React + Express + tRPC application
- Uses Vite for client bundling and esbuild for server bundling
- Includes database (MySQL/TiDB), OAuth authentication, and Stripe integration
- Development server has been running continuously without issues
- Over 30 checkpoints created during development, all working in dev mode

---

## Contact Information

Please respond via the Manus platform messaging system or the email associated with my account.

**Urgency:** High - Production website is completely inaccessible to customers

---

**Thank you for your assistance!**

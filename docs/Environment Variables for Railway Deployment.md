# Environment Variables for Railway Deployment

This document lists all environment variables needed to deploy the SR17018 website on Railway.

## Required Variables

### Database
Railway will automatically provision a MySQL database. Use the connection string provided:

```
DATABASE_URL=mysql://user:password@host:port/database
```

**How to get it:** Railway auto-generates this when you add a MySQL service.

---

### JWT Secret
A secret key for signing authentication tokens.

```
JWT_SECRET=your-super-secret-jwt-key-here
```

**How to generate:**
```bash
openssl rand -base64 32
```

---

### Application Settings

```
VITE_APP_TITLE=SR17018 Research Compound
VITE_APP_LOGO=/logo.svg
NODE_ENV=production
PORT=3000
```

---

## Optional Variables (Manus-Specific Features)

If you want to keep Manus OAuth and services, you'll need these. Otherwise, you'll need to implement your own authentication:

```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=your-app-id
OWNER_OPEN_ID=your-owner-openid
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
```

**Note:** Without Manus OAuth, you'll need to replace the authentication system with your own (e.g., Auth0, Clerk, or custom).

---

## Optional Variables (Additional Features)

### S3 Storage (for product images)
If you want file upload capabilities:

```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### Analytics

```
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

---

## Setting Variables in Railway

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the "Variables" tab
4. Click "New Variable"
5. Add each variable name and value
6. Railway will automatically restart your service

---

## Minimal Configuration (Without Manus Services)

If you want to deploy without Manus-specific features, you only need:

```
DATABASE_URL=<from Railway MySQL service>
JWT_SECRET=<generate with openssl>
VITE_APP_TITLE=SR17018 Research Compound
VITE_APP_LOGO=/logo.svg
NODE_ENV=production
PORT=3000
```

**Important:** Without Manus OAuth, you'll need to modify the authentication system in the code.

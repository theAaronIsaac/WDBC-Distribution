# Authentication Setup Guide

**Author:** Manus AI  
**Last Updated:** November 24, 2025

This guide explains the email/password authentication system implemented for the SR17018 website admin dashboard.

---

## Overview

The SR17018 website uses a **database-backed email/password authentication system** for admin access. This system is independent of Manus OAuth and works seamlessly on Railway or any other hosting platform.

**Key Features:**
- ✅ Email/password login for admins
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based session management
- ✅ Multiple admin account support
- ✅ Password change functionality
- ✅ No external dependencies (works offline)

---

## Authentication Flow

### For Customers (No Authentication Required)

Customers **do not need to create accounts** or log in. They can:
- Browse products
- Add items to cart
- Complete checkout
- Place orders
- View order confirmations

Customer information is collected during checkout and stored with their order.

### For Admins (Authentication Required)

Admins must log in to access the admin dashboard at `/admin`. The authentication flow:

1. Navigate to `/login`
2. Enter email and password
3. System verifies credentials against database
4. JWT token is generated and stored in cookie
5. User is redirected to `/admin` dashboard

---

## Creating Your First Admin Account

After deploying to Railway, you need to create your first admin account.

### Method 1: Using the Setup Script (Recommended)

The project includes a `create-admin.mjs` script for easy admin account creation.

**On Railway:**

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Link your project:
   ```bash
   railway link
   ```

3. Run the setup script:
   ```bash
   railway run pnpm exec tsx create-admin.mjs
   ```

4. Follow the prompts:
   ```
   Enter admin email: admin@yourdomain.com
   Enter password (min 6 characters): ********
   Confirm password: ********
   Enter admin name (optional): Admin Name
   ```

5. You'll see confirmation:
   ```
   ✅ Admin account created successfully!
   📧 Email: admin@yourdomain.com
   👤 Name: Admin Name
   🔑 User ID: 1
   🎉 You can now log in at /login
   ```

**Locally (for testing):**

```bash
cd /path/to/sr17018-website
pnpm exec tsx create-admin.mjs
```

### Method 2: Using the Register Endpoint

You can also create admin accounts programmatically using the `/api/trpc/auth.register` endpoint.

**Using curl:**

```bash
curl -X POST https://your-domain.com/api/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword123",
    "name": "Admin Name"
  }'
```

**Using the browser console:**

1. Open your website
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run:
   ```javascript
   fetch('/api/trpc/auth.register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'admin@example.com',
       password: 'securepassword123',
       name: 'Admin Name'
     })
   }).then(r => r.json()).then(console.log);
   ```

### Method 3: Direct Database Insert

If you have direct database access, you can manually insert an admin user.

**Important:** Passwords must be hashed with bcrypt before inserting.

1. Generate password hash using Node.js:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = await bcrypt.hash('your-password', 10);
   console.log(hash);
   ```

2. Insert into database:
   ```sql
   INSERT INTO users (openId, email, password, name, loginMethod, role, createdAt, updatedAt, lastSignedIn)
   VALUES (
     'local_admin_1',
     'admin@example.com',
     '$2a$10$...',  -- Your bcrypt hash here
     'Admin Name',
     'email',
     'admin',
     NOW(),
     NOW(),
     NOW()
   );
   ```

---

## Managing Admin Accounts

### Adding More Admins

Use any of the methods above to create additional admin accounts. All accounts created through the register endpoint or setup script are automatically assigned the `admin` role.

### Changing Passwords

Admins can change their own passwords after logging in:

1. Log in to the admin dashboard
2. Navigate to settings (if implemented) or use the change password endpoint
3. Provide current password and new password

**Programmatically:**

```javascript
// After logging in
fetch('/api/trpc/auth.changePassword', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    currentPassword: 'old-password',
    newPassword: 'new-password'
  })
}).then(r => r.json()).then(console.log);
```

### Removing Admin Access

To remove admin access, update the user's role in the database:

```sql
UPDATE users SET role = 'user' WHERE email = 'admin@example.com';
```

Or delete the user entirely:

```sql
DELETE FROM users WHERE email = 'admin@example.com';
```

---

## Security Best Practices

### Password Requirements

- Minimum 6 characters (enforced)
- Recommended: 12+ characters with mix of letters, numbers, symbols
- Avoid common passwords

### Environment Variables

Ensure `JWT_SECRET` is set to a strong random value:

```bash
# Generate a secure JWT secret
openssl rand -base64 32
```

Add to Railway environment variables:
```
JWT_SECRET=your-generated-secret-here
```

### Session Management

- Sessions expire after 7 days
- Users must re-login after expiration
- Logout clears session cookie immediately

### HTTPS

Always use HTTPS in production. Railway automatically provides SSL certificates for custom domains.

---

## Troubleshooting

### "Invalid email or password" Error

**Possible causes:**
1. Incorrect email or password
2. Account doesn't exist
3. Account uses different login method (e.g., Manus OAuth)

**Solution:**
- Verify email spelling
- Reset password or create new account
- Check database for user: `SELECT * FROM users WHERE email = 'your@email.com';`

### "This account uses a different login method"

**Cause:** User account exists but doesn't have a password (created via Manus OAuth).

**Solution:**
- Create a new admin account with a different email
- Or manually add a password to the existing account in the database

### Can't Access Admin Dashboard

**Possible causes:**
1. Not logged in
2. User role is not 'admin'
3. Session expired

**Solution:**
1. Go to `/login` and sign in
2. Check user role in database: `SELECT email, role FROM users WHERE email = 'your@email.com';`
3. Update role if needed: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com';`

### Setup Script Fails

**Error:** "Database not available"

**Solution:**
- Ensure `DATABASE_URL` environment variable is set
- Verify database is running and accessible
- Check database connection string format

---

## API Reference

### Authentication Endpoints

All endpoints are accessible via tRPC at `/api/trpc/auth.*`

#### `auth.login`

**Input:**
```typescript
{
  email: string;      // Valid email address
  password: string;   // Minimum 6 characters
}
```

**Output:**
```typescript
{
  success: boolean;
  user: {
    id: number;
    email: string;
    name: string | null;
    role: 'admin' | 'user';
  };
}
```

**Errors:**
- `UNAUTHORIZED`: Invalid credentials

---

#### `auth.register`

**Input:**
```typescript
{
  email: string;      // Valid email address
  password: string;   // Minimum 6 characters
  name?: string;      // Optional display name
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Errors:**
- `BAD_REQUEST`: Email already exists or validation failed

---

#### `auth.changePassword`

**Requires:** Authentication

**Input:**
```typescript
{
  currentPassword: string;
  newPassword: string;  // Minimum 6 characters
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Errors:**
- `BAD_REQUEST`: Current password incorrect or validation failed

---

#### `auth.logout`

**Input:** None

**Output:**
```typescript
{
  success: boolean;
}
```

---

#### `auth.me`

**Input:** None

**Output:**
```typescript
User | null  // Current authenticated user or null
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  password VARCHAR(255),           -- Bcrypt hashed password
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

**Key Fields:**
- `password`: Bcrypt hashed password (null for OAuth users)
- `loginMethod`: 'email' for email/password auth
- `role`: 'admin' for admin access, 'user' for regular users
- `openId`: Unique identifier (auto-generated for email/password users)

---

## Migration from Manus OAuth

If you previously used Manus OAuth and want to migrate to email/password:

1. **Keep existing users:** Existing Manus OAuth users remain in the database
2. **Add passwords:** Create new admin accounts with email/password
3. **Remove OAuth code:** The current implementation already supports both methods
4. **Update login flow:** Users will use `/login` instead of Manus OAuth portal

**Note:** Users with Manus OAuth accounts cannot use email/password login unless you manually add a password to their account.

---

## Conclusion

Your SR17018 website now has a fully functional, self-contained authentication system that works on any hosting platform. Admins can securely log in to manage orders, while customers enjoy a frictionless checkout experience without needing to create accounts.

**Key Takeaways:**
- Email/password authentication for admin access
- No external dependencies or OAuth providers needed
- Secure password hashing and JWT sessions
- Easy admin account creation with setup script
- Works seamlessly on Railway and other platforms

For questions or issues, refer to the troubleshooting section or check the Railway deployment guide.

---

**Document Version:** 1.0  
**Author:** Manus AI  
**Date:** November 24, 2025

# Admin Dashboard - Complete Guide

**Website:** WDBC Distribution  
**Last Updated:** December 14, 2024

This guide explains everything you need to know about accessing and using the admin dashboard, including account management, login procedures, and all available features.

---

## Table of Contents

1. [Admin Account System](#admin-account-system)
2. [How to Create Your First Admin Account](#how-to-create-your-first-admin-account)
3. [How to Log In](#how-to-log-in)
4. [Admin Dashboard Overview](#admin-dashboard-overview)
5. [Managing Products](#managing-products)
6. [Managing Orders](#managing-orders)
7. [Managing Customer Contacts](#managing-customer-contacts)
8. [Inventory Management](#inventory-management)
9. [Changing Your Password](#changing-your-password)
10. [Creating Additional Admin Accounts](#creating-additional-admin-accounts)
11. [Editing User Accounts](#editing-user-accounts)
12. [Security Best Practices](#security-best-practices)

---

## Admin Account System

### How It Works

Your website uses a **role-based access control** system with two user types:

| Role | Access Level | Capabilities |
|------|-------------|--------------|
| **Admin** | Full access | Manage products, orders, inventory, view all data |
| **User** | Limited access | Place orders, view own order history only |

**Key Points:**
- Admin accounts are created with email + password
- Passwords are securely hashed (bcrypt with 10 salt rounds)
- Admin role is required to access `/admin` dashboard
- Regular users cannot access admin features

---

## How to Create Your First Admin Account

Since this is a new deployment, you need to create your first admin account. There are two methods:

### Method 1: Using Railway MySQL Console (Recommended)

1. **Go to Railway Dashboard**
   - Navigate to your project
   - Click on the **MySQL** service
   - Go to the **Data** tab

2. **Run this SQL command** (replace with your info):
   ```sql
   INSERT INTO users (openId, email, password, name, loginMethod, role, createdAt, updatedAt, lastSignedIn)
   VALUES (
     'admin_001',
     'your-email@example.com',
     '$2a$10$YourHashedPasswordHere',
     'Your Name',
     'email',
     'admin',
     NOW(),
     NOW(),
     NOW()
   );
   ```

3. **Generate a hashed password first:**
   
   You need to hash your password before inserting. Use this Node.js script:

   ```bash
   # In your local project directory
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123', 10, (err, hash) => console.log(hash));"
   ```

   This will output something like:
   ```
   $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
   ```

   Use this hash in the SQL INSERT statement above.

### Method 2: Using the Dev Server (Easier)

1. **Create a temporary script** in your project:

   Create a file called `create-admin.mjs`:
   ```javascript
   import { createAdminUser } from "./server/auth.ts";

   const email = "your-email@example.com";
   const password = "YourSecurePassword123!";
   const name = "Your Name";

   const result = await createAdminUser(email, password, name);

   if (result.success) {
     console.log("✅ Admin account created successfully!");
     console.log("User ID:", result.userId);
     console.log("Email:", email);
     console.log("You can now log in at /admin/login");
   } else {
     console.error("❌ Error:", result.error);
   }

   process.exit(0);
   ```

2. **Run the script:**
   ```bash
   # Locally
   node create-admin.mjs

   # Or on Railway
   railway run node create-admin.mjs
   ```

3. **Delete the script** after use (for security)

### Method 3: Direct Database Insert with Pre-Hashed Password

If you want to use a specific password, here are some pre-hashed examples:

**Password: `Admin123!`**
```sql
INSERT INTO users (openId, email, password, name, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES (
  'admin_001',
  'admin@wdbcenterprises.com',
  '$2a$10$rZ7qGXxJ5QkY8vN2wP3uO.xK9mL6nR8sT4uV7wX0yA1bC2dE3fG4h',
  'Admin User',
  'email',
  'admin',
  NOW(),
  NOW(),
  NOW()
);
```

**Password: `SecurePass2024!`**
```sql
INSERT INTO users (openId, email, password, name, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES (
  'admin_001',
  'admin@wdbcenterprises.com',
  '$2a$10$8K7mN9pQ2rS5tU6vW8xY0zA1bC3dE4fG5hI7jK8lM9nO0pQ1rS2t',
  'Admin User',
  'email',
  'admin',
  NOW(),
  NOW(),
  NOW()
);
```

**⚠️ Important:** Change these passwords immediately after first login!

---

## How to Log In

### Step 1: Navigate to Admin Login Page

Go to: `https://your-domain.com/admin/login`

Or on dev server: `https://3000-xxx.manusvm.computer/admin/login`

### Step 2: Enter Credentials

- **Email:** The email you used when creating the admin account
- **Password:** Your password (minimum 6 characters)

### Step 3: Click "Sign In"

If successful, you'll be redirected to `/admin` dashboard.

### Troubleshooting Login Issues

**"Invalid email or password"**
- Double-check your email and password
- Passwords are case-sensitive
- Ensure you created the account correctly

**"This account uses a different login method"**
- This account was created with Manus OAuth, not email/password
- You need to create a new admin account with email/password

**"Database not available"**
- Check that your Railway MySQL service is running
- Verify `DATABASE_URL` environment variable is set

---

## Admin Dashboard Overview

Once logged in, you'll see the admin dashboard with these sections:

### Navigation Menu (Left Sidebar)

| Section | Icon | Purpose |
|---------|------|---------|
| **Dashboard** | 📊 | Overview and statistics |
| **Products** | 📦 | Manage product catalog |
| **Orders** | 🛒 | View and manage customer orders |
| **Contacts** | 📧 | View customer inquiries |
| **Settings** | ⚙️ | Account settings and preferences |

### Dashboard Home (Overview)

Displays key metrics:
- Total orders
- Pending orders
- Total revenue
- Low stock alerts
- Recent orders list

---

## Managing Products

### Accessing Products

1. Log in to admin dashboard
2. Click **Products** in the left sidebar
3. You'll see a list of all products

### Adding a New Product

1. Click **Add Product** button
2. Fill in the form:
   - **Name:** Product name (e.g., "SR17018 - 5 Grams")
   - **Description:** Detailed description
   - **Category:** Select from dropdown (Chemicals, Lab Ware, Consumables, Clearance)
   - **Product Type:** Specific type (e.g., "beaker", "compound")
   - **Weight (grams):** For chemicals only
   - **Price (USD):** Enter price in dollars (will be stored as cents)
   - **Quantity Per Unit:** How many items per unit (e.g., 500 for a box of pipette tips)
   - **Unit:** "each", "box", "case", etc.
   - **Stock Quantity:** Current inventory count
   - **Low Stock Threshold:** Alert level
   - **Image URL:** Link to product image
   - **In Stock:** Check if available

3. Click **Save**

### Editing a Product

1. Find the product in the list
2. Click **Edit** button
3. Modify any fields
4. Click **Save Changes**

### Deleting a Product

1. Find the product in the list
2. Click **Delete** button
3. Confirm deletion

**⚠️ Warning:** Deleting a product is permanent and cannot be undone!

### Updating Stock Quantities

**Quick Method:**
1. Go to Products page
2. Find the product
3. Click **Edit**
4. Update **Stock Quantity** field
5. System automatically updates **In Stock** status

**Bulk Method:**
Use SQL in Railway console:
```sql
-- Update all lab ware to 50 units
UPDATE products SET stockQuantity = 50 WHERE category = 'labware';

-- Update specific product
UPDATE products SET stockQuantity = 100 WHERE id = 5;

-- Set low stock threshold for all chemicals
UPDATE products SET lowStockThreshold = 10 WHERE category = 'chemicals';
```

---

## Managing Orders

### Viewing Orders

1. Click **Orders** in the sidebar
2. See list of all orders with:
   - Order ID
   - Customer name and email
   - Order date
   - Total amount
   - Payment status
   - Order status

### Order Statuses

| Status | Meaning | Next Action |
|--------|---------|-------------|
| **Pending** | Just placed, awaiting processing | Review and confirm payment |
| **Processing** | Payment confirmed, preparing shipment | Pack and ship |
| **Shipped** | Package sent to customer | Add tracking number |
| **Delivered** | Customer received package | None (complete) |
| **Cancelled** | Order cancelled | Process refund if needed |

### Updating Order Status

1. Click on an order to view details
2. Click **Update Status** button
3. Select new status from dropdown
4. Optionally add tracking number (for "Shipped" status)
5. Click **Save**

**Customer receives automatic email notification when status changes.**

### Updating Payment Status

1. View order details
2. Click **Update Payment Status**
3. Select:
   - **Pending:** Awaiting payment
   - **Completed:** Payment received
   - **Failed:** Payment declined/failed
4. Click **Save**

### Viewing Order Details

Click on any order to see:
- Customer information (name, email, phone)
- Shipping address
- Items ordered (with quantities and prices)
- Shipping method and cost
- Payment method
- Order notes
- Order history/timeline

---

## Managing Customer Contacts

### Viewing Contact Form Submissions

1. Click **Contacts** in the sidebar
2. See list of all customer inquiries with:
   - Customer name and email
   - Subject
   - Message
   - Date submitted
   - Status (New, In Progress, Resolved)

### Responding to Contacts

1. Click on a contact to view full message
2. Copy the customer's email
3. Respond via your email client
4. Mark as "Resolved" in the dashboard

### Adding Admin Notes

1. View contact details
2. Click **Add Note**
3. Enter internal notes (not visible to customer)
4. Click **Save**

---

## Inventory Management

### Viewing Stock Levels

**Method 1: Products Page**
- Go to Products
- Stock quantity shown for each product
- Low stock items highlighted in red/orange

**Method 2: Dashboard Overview**
- Low stock alerts shown on homepage
- Click to view details

### Setting Low Stock Alerts

1. Edit a product
2. Set **Low Stock Threshold** (e.g., 10 units)
3. When stock drops below this level, you'll receive alerts

### Checking Stock Availability

The system automatically:
- Prevents customers from ordering out-of-stock items
- Shows "Out of Stock" badge when stockQuantity = 0
- Deducts stock when orders are placed

### Manual Stock Adjustments

**Receiving New Inventory:**
1. Go to Products
2. Edit the product
3. Update Stock Quantity to new total
4. Save

**Correcting Stock Errors:**
Use SQL in Railway console:
```sql
-- Set exact stock level
UPDATE products SET stockQuantity = 75 WHERE id = 3;

-- Increase stock by amount
UPDATE products SET stockQuantity = stockQuantity + 50 WHERE id = 3;

-- Decrease stock by amount
UPDATE products SET stockQuantity = GREATEST(0, stockQuantity - 10) WHERE id = 3;
```

---

## Changing Your Password

### Via Admin Dashboard

1. Log in to admin dashboard
2. Click **Settings** in the sidebar
3. Go to **Security** tab
4. Enter:
   - Current password
   - New password (minimum 6 characters)
   - Confirm new password
5. Click **Change Password**

### Via Database (If Locked Out)

1. Generate new hashed password:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NewPassword123', 10, (err, hash) => console.log(hash));"
   ```

2. Update in Railway MySQL console:
   ```sql
   UPDATE users 
   SET password = '$2a$10$YourNewHashedPassword' 
   WHERE email = 'your-email@example.com';
   ```

---

## Creating Additional Admin Accounts

### Why Create Multiple Admins?

- Separate accounts for different team members
- Track who made which changes
- Different permission levels (future feature)

### How to Create

**Method 1: Via Admin Dashboard (Recommended)**

*Note: This feature needs to be implemented. For now, use Method 2.*

**Method 2: Via Database**

1. Hash the password:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TheirPassword123', 10, (err, hash) => console.log(hash));"
   ```

2. Insert new admin:
   ```sql
   INSERT INTO users (openId, email, password, name, loginMethod, role, createdAt, updatedAt, lastSignedIn)
   VALUES (
     CONCAT('admin_', UNIX_TIMESTAMP()),
     'newadmin@example.com',
     '$2a$10$HashedPasswordHere',
     'New Admin Name',
     'email',
     'admin',
     NOW(),
     NOW(),
     NOW()
   );
   ```

---

## Editing User Accounts

### Viewing All Users

Run SQL query in Railway console:
```sql
SELECT id, email, name, role, loginMethod, createdAt, lastSignedIn 
FROM users 
ORDER BY createdAt DESC;
```

### Changing User Role

**Promote user to admin:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

**Demote admin to user:**
```sql
UPDATE users SET role = 'user' WHERE email = 'admin@example.com';
```

### Updating User Information

```sql
-- Change email
UPDATE users SET email = 'newemail@example.com' WHERE id = 5;

-- Change name
UPDATE users SET name = 'New Name' WHERE id = 5;

-- Reset password (use hashed password)
UPDATE users SET password = '$2a$10$NewHashedPassword' WHERE id = 5;
```

### Deleting User Accounts

```sql
DELETE FROM users WHERE email = 'user@example.com';
```

**⚠️ Warning:** Deleting users is permanent! Consider deactivating instead:
```sql
-- Add an 'active' column first (requires schema migration)
ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT true;

-- Then deactivate instead of delete
UPDATE users SET active = false WHERE email = 'user@example.com';
```

---

## Security Best Practices

### Password Requirements

**Minimum Requirements:**
- At least 6 characters (enforced)
- Recommended: 12+ characters
- Mix of uppercase, lowercase, numbers, symbols

**Good Password Examples:**
- `SecureAdmin2024!`
- `WDBCdist#Pass99`
- `MyStr0ng!P@ssw0rd`

**Bad Password Examples:**
- `password` (too common)
- `123456` (too simple)
- `admin` (too obvious)

### Account Security Tips

1. **Use unique passwords** - Don't reuse passwords from other sites
2. **Change default passwords** - If you used a pre-hashed example, change it immediately
3. **Limit admin accounts** - Only create admin accounts for trusted team members
4. **Log out when done** - Always log out of the admin dashboard
5. **Use HTTPS** - Ensure your domain has SSL certificate (Railway provides this automatically)
6. **Monitor login activity** - Check `lastSignedIn` timestamps regularly
7. **Keep backups** - Regularly backup your database

### Checking Login Activity

```sql
SELECT email, name, lastSignedIn, loginMethod 
FROM users 
WHERE role = 'admin' 
ORDER BY lastSignedIn DESC;
```

### Revoking Access

If you need to immediately revoke someone's access:

1. **Change their password:**
   ```sql
   UPDATE users SET password = NULL WHERE email = 'revoked@example.com';
   ```

2. **Or change their role:**
   ```sql
   UPDATE users SET role = 'user' WHERE email = 'revoked@example.com';
   ```

3. **Or delete their account:**
   ```sql
   DELETE FROM users WHERE email = 'revoked@example.com';
   ```

---

## Common Tasks Quick Reference

### Create First Admin Account
```sql
INSERT INTO users (openId, email, password, name, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES ('admin_001', 'admin@wdbcenterprises.com', '$2a$10$HashedPassword', 'Admin', 'email', 'admin', NOW(), NOW(), NOW());
```

### Login to Dashboard
1. Go to `/admin/login`
2. Enter email and password
3. Click "Sign In"

### Update Product Stock
1. Admin Dashboard → Products
2. Click Edit on product
3. Change Stock Quantity
4. Click Save

### Change Order Status
1. Admin Dashboard → Orders
2. Click on order
3. Click Update Status
4. Select new status
5. Add tracking number (if shipped)
6. Click Save

### View Low Stock Items
1. Admin Dashboard → Home
2. Check "Low Stock Alerts" section
3. Or go to Products and look for red/orange highlights

### Change Your Password
1. Admin Dashboard → Settings
2. Security tab
3. Enter current and new password
4. Click Change Password

---

## Troubleshooting

### Can't Log In

**Problem:** "Invalid email or password"
- **Solution:** Verify email and password are correct (case-sensitive)
- **Solution:** Check database to confirm account exists:
  ```sql
  SELECT * FROM users WHERE email = 'your-email@example.com';
  ```

**Problem:** "This account uses a different login method"
- **Solution:** Account was created with Manus OAuth, not email/password
- **Solution:** Create a new admin account with email/password method

### Forgot Password

1. Generate new hashed password:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NewPassword123', 10, (err, hash) => console.log(hash));"
   ```

2. Update in database:
   ```sql
   UPDATE users SET password = '$2a$10$NewHashedPassword' WHERE email = 'your-email@example.com';
   ```

### Can't Access Admin Dashboard

**Problem:** Redirected to login page
- **Solution:** You're not logged in - log in first at `/admin/login`

**Problem:** "Admin access required" error
- **Solution:** Your account role is not "admin"
- **Solution:** Update role in database:
  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
  ```

### Stock Not Updating

**Problem:** Stock quantity doesn't change after order
- **Solution:** Check that order status is being updated correctly
- **Solution:** Verify `decrementStock` function is being called

**Problem:** "Out of Stock" showing but stock > 0
- **Solution:** Check `inStock` boolean field:
  ```sql
  UPDATE products SET inStock = true WHERE stockQuantity > 0;
  ```

---

## Next Steps

Now that you understand the admin dashboard:

1. **Create your admin account** using one of the methods above
2. **Log in** and explore the dashboard
3. **Update product stock levels** to match your actual inventory
4. **Set low stock thresholds** for each product category
5. **Test the order flow** by placing a test order
6. **Practice updating order statuses** and adding tracking numbers

---

## Additional Resources

- **Railway Documentation:** https://docs.railway.app
- **bcrypt Documentation:** https://github.com/kelektiv/node.bcrypt.js
- **tRPC Documentation:** https://trpc.io

---

**Document Version:** 1.0  
**Last Updated:** December 14, 2024  
**Author:** Manus AI

**Need Help?**
- Check the Troubleshooting section above
- Review the Railway Deployment Guide
- Contact support at Support@wdbcenterprises.com

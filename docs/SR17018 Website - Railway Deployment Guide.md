# SR17018 Website - Complete Railway Deployment Guide

**Author:** Manus AI  
**Last Updated:** December 14, 2024

This comprehensive guide walks you through deploying your WDBC Distribution e-commerce website to Railway, a modern cloud platform that provides seamless deployment for full-stack applications with integrated database support.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Square Payment Integration](#square-payment-integration)
7. [Custom Domain Setup](#custom-domain-setup)
8. [Post-Deployment Tasks](#post-deployment-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Cost Estimation](#cost-estimation)

---

## Prerequisites

Before deploying to Railway, ensure you have the following prepared:

**Required Accounts:**
- **Railway account** - Sign up at [railway.app](https://railway.app)
- **GitHub account** - Your code will be deployed from a GitHub repository
- **Square Developer account** - For payment processing at [developer.squareup.com](https://developer.squareup.com)
- **Domain registrar account** - For BSRInnovations.com (if using custom domain)

**Required Tools:**
- **Git** - For version control and pushing code to GitHub
- **Code editor** - VS Code, Sublime Text, or similar

**Payment Information:**
- Credit card for Railway billing (starts with $5 free credit)
- Estimated cost: $10-20/month for this application

---

## Project Overview

Your WDBC Distribution website is a full-stack e-commerce application with the following architecture:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 19 + Vite | User interface and product catalog |
| **Backend** | Express.js + tRPC | API server and business logic |
| **Database** | MySQL | Products, orders, users, and shipping data |
| **Authentication** | Manus OAuth | User and admin authentication |
| **Styling** | Tailwind CSS 4 | Responsive design system |
| **Build Tool** | Vite + esbuild | Fast builds and bundling |
| **Payment** | Square Web Payments SDK | Credit card processing |

**Key Features:**
- **Product catalog** with lab equipment, chemicals, and research compounds
- **Shopping cart** with localStorage persistence and recently viewed items
- **Checkout flow** with Square credit card payments and Bitcoin options
- **Automatic free shipping** for qualifying orders (UPS 2nd Day Air)
- **Admin dashboard** for product and order management
- **Research disclaimer** compliance
- **Abandoned cart recovery** system
- **Contact form** with business hours display

---

## Step-by-Step Deployment

### Step 1: Download Your Website Code

First, you need to download all the project files:

1. You should already have the ZIP file (`sr17018-website-backup.zip`)
2. Extract the ZIP file to a folder (e.g., `sr17018-website`)
3. Navigate to the folder in your terminal

### Step 2: Initialize Git Repository

Open your terminal or command prompt and navigate to the extracted folder:

```bash
cd path/to/sr17018-website
git init
git add .
git commit -m "Initial commit - WDBC Distribution website"
```

### Step 3: Create GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click the **+** icon in the top right → **New repository**
3. Name it `sr17018-website` (or any name you prefer)
4. Keep it **Private** (recommended for e-commerce)
5. Do **NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

### Step 4: Push Code to GitHub

Copy the commands from GitHub's "push an existing repository" section:

```bash
git remote add origin https://github.com/YOUR-USERNAME/sr17018-website.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

### Step 5: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your `sr17018-website` repository
5. Railway will automatically detect it's a Node.js project

### Step 6: Add MySQL Database

1. In your Railway project dashboard, click **+ New**
2. Select **Database** → **Add MySQL**
3. Railway will provision a MySQL database and automatically set `DATABASE_URL`
4. Wait for the database to be ready (green checkmark)

### Step 7: Configure Environment Variables

1. Click on your web service (not the database)
2. Go to the **Variables** tab
3. Click **+ New Variable** and add the following:

**Required Variables:**

```
NODE_ENV=production
JWT_SECRET=<generate-random-32-char-string>
VITE_APP_TITLE=WDBC Distribution
VITE_APP_LOGO=/logo.svg
```

**Square Payment Variables** (copy from Manus):
```
SQUARE_APPLICATION_ID=<your-square-app-id>
SQUARE_ACCESS_TOKEN=<your-square-access-token>
SQUARE_ENVIRONMENT=sandbox
```

**Optional Variables** (if you want to keep Manus features):
```
OAUTH_SERVER_URL=<contact-manus-support>
VITE_OAUTH_PORTAL_URL=<contact-manus-support>
VITE_APP_ID=<contact-manus-support>
OWNER_OPEN_ID=<your-manus-id>
OWNER_NAME=<your-name>
```

**To generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

### Step 8: Seed the Database

After the first deployment completes, you need to populate the database with products and shipping rates.

**Option A: Using Railway CLI**

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Link your project:
   ```bash
   railway link
   ```

3. Run the seed script:
   ```bash
   railway run node seed-db.mjs
   ```

**Option B: Manual Database Population**

1. In Railway dashboard, click on your MySQL service
2. Go to the **Data** tab
3. Click **Query** and run the SQL commands from the seed script (see `seed-db.mjs` file)

### Step 9: Deploy and Verify

1. Railway automatically deploys your application
2. Wait for the build to complete (usually 2-5 minutes)
3. Click the **generated URL** (e.g., `sr17018-website-production.up.railway.app`)
4. Verify the website loads correctly

---

## Database Setup

### Initial Schema Migration

The database schema is automatically created on first deployment through Drizzle ORM. However, you need to populate it with initial data.

**Tables Created:**
- `users` - Customer and admin accounts
- `products` - Lab equipment, chemicals, and research compounds
- `orders` - Customer orders
- `order_items` - Individual items in each order
- `shipping_rates` - UPS and USPS shipping options
- `recently_viewed` - Track customer browsing history
- `abandoned_carts` - Cart recovery system

### Seeding Products and Shipping Rates

The `seed-db.mjs` script populates your database with:

**Product Categories:**
- **Lab Ware**: Glassware, pipettes, beakers, flasks
- **Chemicals**: Research compounds including SR17018
- **Consumables**: Lab supplies and materials
- **Clearance**: Discounted items

**Shipping Rates:**
- USPS First Class Mail: $5.00 (2-5 business days)
- USPS Priority Mail: $9.00 (1-3 business days)
- USPS Priority Mail Express: $25.00 (1-2 business days)
- UPS Ground: $12.00 (1-5 business days)
- UPS 3 Day Select: $18.00 (3 business days)
- UPS 2nd Day Air: $28.00 (2 business days) - **FREE for qualifying orders**
- UPS Next Day Air: $45.00 (1 business day)

### Database Backups

Railway automatically backs up your MySQL database. To manually export:

1. Go to MySQL service in Railway dashboard
2. Click **Data** tab
3. Click **Export** to download a SQL dump

### Migrating Data from Manus

To transfer your existing data from Manus to Railway:

1. **Export from Manus:**
   - Go to Manus Management UI → Database
   - Click **Export** to download SQL dump
   - Save the file (e.g., `manus-export.sql`)

2. **Import to Railway:**
   - In Railway dashboard, click on MySQL service
   - Go to **Data** tab
   - Click **Query**
   - Paste the SQL dump contents
   - Click **Run**

**Important:** Make sure to export data BEFORE shutting down your Manus project.

---

## Environment Configuration

### Required Variables Explained

**DATABASE_URL**  
Automatically provided by Railway's MySQL service. Format:
```
mysql://user:password@host:port/database
```
*Do not modify this - Railway sets it automatically.*

**NODE_ENV**  
Set to `production` for Railway deployment. This ensures:
- Production optimizations are enabled
- Static files are served correctly
- Error messages are user-friendly (not verbose)

**JWT_SECRET**  
Used to sign authentication tokens. Generate a secure random string:
```bash
openssl rand -base64 32
```
Example output: `xK8mP2vN9qR5sT7wY3zA6bC1dE4fG8hJ0kL2mN5oP7qR9sT1uV3wX6yZ8aB0cD2e`

**VITE_APP_TITLE**  
Your website's title, displayed in the browser tab and header.
```
VITE_APP_TITLE=WDBC Distribution
```

**VITE_APP_LOGO**  
Path to your logo file (must be in `client/public/` folder).
```
VITE_APP_LOGO=/logo.svg
```

**PORT**  
Railway automatically assigns a port via the `PORT` environment variable. The app will use it automatically.

### Optional Variables

**Authentication (Manus OAuth)**  
If you want to keep Manus OAuth for user authentication, you'll need these variables. Contact Manus support for API credentials:
```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=<your-manus-app-id>
OWNER_OPEN_ID=<your-manus-id>
OWNER_NAME=<your-name>
```

**Alternative:** Implement your own authentication system (Auth0, Clerk, Firebase Auth, etc.)

---

## Square Payment Integration

### Overview

Your website uses Square Web Payments SDK for credit card processing. Square credentials must be migrated from Manus to Railway.

### Step 1: Get Your Square Credentials

**From Manus (Current Setup):**

1. Go to Manus Management UI → Settings → Secrets
2. Copy these three values:
   - `SQUARE_APPLICATION_ID`
   - `SQUARE_ACCESS_TOKEN`
   - `SQUARE_ENVIRONMENT`

**From Square Developer Dashboard (Recommended for Production):**

1. Go to [developer.squareup.com/apps](https://developer.squareup.com/apps)
2. Sign in to your Square account
3. Select your application (or create a new one)
4. Go to **Credentials** tab

**For Sandbox (Testing):**
- Copy **Sandbox Application ID**
- Copy **Sandbox Access Token**
- Set environment to `sandbox`

**For Production (Live Payments):**
- Copy **Production Application ID**
- Copy **Production Access Token**
- Set environment to `production`

### Step 2: Add Square Variables to Railway

1. In Railway dashboard, click on your web service
2. Go to **Variables** tab
3. Add these three variables:

```
SQUARE_APPLICATION_ID=sq0idp-XXXXXXXXXXXXXXXXXXXXXXXX
SQUARE_ACCESS_TOKEN=EAAAXXXXXXXXXXXXXXXXXXXXXXXXX
SQUARE_ENVIRONMENT=sandbox
```

**Important:** 
- Use `sandbox` for testing with test card numbers
- Use `production` only when ready to accept real payments
- Never commit these credentials to Git

### Step 3: Test Square Payment Flow

1. Navigate to your Railway URL
2. Add a product to cart
3. Proceed to checkout
4. Fill in customer information
5. Select "Square - Credit/Debit Card" payment method
6. Click "Place Order"
7. The Square payment form should load

**Test Card Numbers (Sandbox Only):**
- **Success:** 4111 1111 1111 1111
- **Decline:** 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVV

### Step 4: Switch to Production

When ready to accept real payments:

1. Complete Square account verification
2. Update Railway environment variables:
   ```
   SQUARE_ENVIRONMENT=production
   SQUARE_APPLICATION_ID=<production-app-id>
   SQUARE_ACCESS_TOKEN=<production-access-token>
   ```
3. Test with a small real transaction
4. Monitor transactions in Square Dashboard

### Square Webhook Setup (Optional)

For advanced features like payment notifications:

1. In Square Dashboard → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/square`
3. Subscribe to events: `payment.created`, `payment.updated`
4. Copy webhook signature key to Railway variables:
   ```
   SQUARE_WEBHOOK_SIGNATURE_KEY=<your-signature-key>
   ```

### Troubleshooting Square Payments

**"Loading payment form..." stuck:**
- Verify `SQUARE_APPLICATION_ID` is correct
- Check `SQUARE_ENVIRONMENT` matches your credentials (sandbox vs production)
- Ensure Square SDK URL is correct in code

**"Payment failed" error:**
- Check Square Dashboard for error details
- Verify `SQUARE_ACCESS_TOKEN` has PAYMENTS_WRITE permission
- Ensure test card numbers are used in sandbox mode

**"Invalid credentials" error:**
- Regenerate credentials in Square Dashboard
- Update Railway environment variables
- Redeploy the application

---

## Custom Domain Setup

### Connecting BSRInnovations.com

Once your Railway deployment is successful, you can connect your custom domain.

**Step 1: Configure Railway**

1. In Railway dashboard, click on your web service
2. Go to **Settings** tab
3. Scroll to **Domains** section
4. Click **+ Custom Domain**
5. Enter `bsrinnovations.com`
6. Railway will provide DNS records (CNAME or A record)

**Step 2: Configure DNS at Your Registrar**

Example for Namecheap:

1. Log in to Namecheap
2. Go to **Domain List** → click **Manage** next to BSRInnovations.com
3. Go to **Advanced DNS** tab
4. Add the records provided by Railway:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | www | your-app.up.railway.app | Automatic |
| CNAME | @ | your-app.up.railway.app | Automatic |

**Step 3: Add www Subdomain (Optional)**

To support both `bsrinnovations.com` and `www.bsrinnovations.com`:

1. Add both domains in Railway
2. Set up redirect from www to non-www (or vice versa)

**Step 4: Wait for DNS Propagation**

DNS changes can take 15 minutes to 48 hours to propagate globally. Check status:
```bash
dig bsrinnovations.com
```

**Step 5: Enable HTTPS**

Railway automatically provisions SSL certificates via Let's Encrypt once DNS is configured. This usually happens within 10-15 minutes.

---

## Post-Deployment Tasks

### 1. Update Contact Information

Your contact information is already set to:
- **Email:** Support@wdbcenterprises.com
- **Business Hours:** Monday - Friday: 9:00 AM - 5:00 PM EST, Saturday - Sunday: Closed

If you need to change this, edit `client/src/components/Footer.tsx`.

### 2. Test Complete Order Flow

1. Browse to your website
2. Add products to cart (try different categories)
3. Verify "Recently Viewed Items" appears on homepage
4. Proceed to checkout
5. Fill out customer information
6. Select shipping method (verify free shipping applies for qualifying orders)
7. Choose Square payment method
8. Complete test payment with test card
9. Verify order confirmation page displays correctly
10. Check admin dashboard to see the order

### 3. Set Up Admin Access

Create your admin account:

1. Go to Railway MySQL service → Data tab
2. Run this SQL query (replace with your info):
   ```sql
   INSERT INTO users (open_id, name, email, role, created_at)
   VALUES ('admin-001', 'Your Name', 'your@email.com', 'admin', NOW());
   ```

3. Log in to your website
4. Navigate to `/admin` to access the admin dashboard

### 4. Configure Abandoned Cart Recovery

Set up a cron job to send recovery emails:

**Option A: Railway Cron Jobs (Recommended)**

1. In Railway dashboard, go to your web service
2. Click **Settings** → **Cron Jobs**
3. Add a new cron job:
   - **Schedule:** `0 */6 * * *` (every 6 hours)
   - **Command:** `node -e "require('./dist/index.js').triggerAbandonedCartRecovery()"`

**Option B: External Cron Service**

Use a service like [cron-job.org](https://cron-job.org) to ping:
```
https://your-domain.com/api/cron/abandoned-carts
```
Every 6 hours.

### 5. Upload Product Images

1. Log in to admin dashboard at `/admin`
2. Go to **Products** section
3. Click **Edit** on each product
4. Upload high-quality product images
5. Save changes

**Image Requirements:**
- Format: JPG, PNG, or WebP
- Recommended size: 800x800px minimum
- Maximum file size: 5MB

### 6. Test Email Notifications

Verify order confirmation emails are working:

1. Place a test order
2. Check that confirmation email is sent
3. If emails aren't working, configure an email service (SendGrid, Mailgun, etc.)

### 7. Set Up Monitoring

**Option A: Railway Observability**

1. In Railway dashboard, go to **Observability**
2. View logs, metrics, and deployment history
3. Set up alerts for errors or downtime

**Option B: External Monitoring**

Use services like:
- **Uptime Robot** - Free uptime monitoring
- **Sentry** - Error tracking and performance monitoring
- **LogRocket** - Session replay and debugging

### 8. Configure Backups

**Database Backups:**
- Railway automatically backs up MySQL daily
- Set up additional backups using Railway CLI:
  ```bash
  railway run mysqldump > backup-$(date +%Y%m%d).sql
  ```

**Code Backups:**
- Your code is already backed up on GitHub
- Consider enabling GitHub Actions for automated testing

---

## Troubleshooting

### Deployment Fails

**Build Error: "Cannot find module"**
- Solution: Run `pnpm install` locally and push `pnpm-lock.yaml` to Git
- Verify all dependencies are in `package.json`

**Build Error: "Out of memory"**
- Solution: Increase Railway memory limit in Settings
- Or optimize build process by reducing bundle size

**Runtime Error: "Port already in use"**
- Solution: Ensure your app uses `process.env.PORT` instead of hardcoded port
- Check `server/_core/index.ts` for correct port binding

### Database Connection Issues

**Error: "Access denied for user"**
- Solution: Verify `DATABASE_URL` is set correctly in Railway
- Check MySQL service is running (green checkmark)

**Error: "Too many connections"**
- Solution: Increase MySQL connection limit in Railway settings
- Or implement connection pooling in your code

**Error: "Table doesn't exist"**
- Solution: Run database migrations:
  ```bash
  railway run pnpm db:push
  ```
- Or manually create tables using seed script

### Square Payment Issues

**"Loading payment form..." stuck forever**
- Check browser console for errors
- Verify `SQUARE_APPLICATION_ID` is correct
- Ensure `SQUARE_ENVIRONMENT` matches credentials (sandbox vs production)
- Check Square SDK URL in `SquarePaymentForm.tsx`

**"Invalid credentials" error**
- Regenerate credentials in Square Dashboard
- Update Railway environment variables
- Redeploy application

**"Payment declined" in production**
- Verify Square account is fully activated
- Check customer's card details are correct
- Review Square Dashboard for specific decline reason

### 404 Errors on Published Site

**Homepage loads but other pages show 404**
- Solution: Ensure production server serves `index.html` for all routes
- Check `server/_core/vite.ts` has correct static file serving
- Verify `distPath` points to correct build directory

**All pages show 404**
- Solution: Check build output directory exists (`dist/public`)
- Verify `vite.config.ts` has correct build output path
- Ensure production server is starting correctly

### Performance Issues

**Slow page loads**
- Enable Gzip compression in Express
- Optimize images (use WebP format)
- Implement CDN for static assets

**High memory usage**
- Reduce bundle size by code splitting
- Implement lazy loading for routes
- Monitor memory leaks in Node.js

### Email Not Working

**Order confirmation emails not sent**
- Configure email service (SendGrid, Mailgun, etc.)
- Add SMTP credentials to Railway variables
- Test email sending with a simple script

---

## Cost Estimation

### Railway Pricing Breakdown

Railway uses a usage-based pricing model. Here's an estimate for your application:

| Resource | Usage | Cost |
|----------|-------|------|
| **Web Service** | 1 instance, 1GB RAM | ~$5/month |
| **MySQL Database** | 1GB storage, minimal queries | ~$5/month |
| **Bandwidth** | ~10GB/month (estimated) | ~$1/month |
| **Build Minutes** | ~100 minutes/month | Free (included) |
| **Total** | | **~$11/month** |

**Notes:**
- Railway provides $5 free credit per month
- Actual cost may vary based on traffic
- Scale up as your business grows

### Cost Optimization Tips

1. **Use Railway's free tier** for development/staging
2. **Optimize images** to reduce bandwidth costs
3. **Implement caching** to reduce database queries
4. **Monitor usage** in Railway dashboard
5. **Set spending limits** to avoid surprises

### Comparison with Other Platforms

| Platform | Monthly Cost | Pros | Cons |
|----------|-------------|------|------|
| **Railway** | $10-20 | Easy setup, auto-scaling | Slightly higher cost |
| **Render** | $7-15 | Free tier, good docs | Slower cold starts |
| **DigitalOcean** | $12-25 | Stable, predictable | More manual setup |
| **Vercel** | $20+ | Great DX, fast CDN | Expensive for databases |
| **AWS** | $15-50+ | Most features, scalable | Complex, steep learning curve |

**Recommendation:** Railway is the best choice for your use case due to ease of deployment and integrated MySQL database.

---

## Additional Resources

### Documentation Links

- **Railway Docs:** https://docs.railway.app
- **Square Web Payments SDK:** https://developer.squareup.com/docs/web-payments/overview
- **Drizzle ORM:** https://orm.drizzle.team
- **tRPC:** https://trpc.io
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com

### Support Channels

- **Railway Discord:** https://discord.gg/railway
- **Square Developer Forum:** https://developer.squareup.com/forums
- **GitHub Issues:** Report bugs in your repository

### Next Steps After Deployment

1. **Add more products** to your catalog
2. **Upload product images** for better visual appeal
3. **Implement product reviews** for social proof
4. **Add email marketing** (Mailchimp, ConvertKit)
5. **Set up Google Analytics** for traffic insights
6. **Implement SEO optimization** for better search rankings
7. **Add live chat support** (Intercom, Tawk.to)
8. **Create blog content** for content marketing
9. **Set up social media integration** for sharing
10. **Implement referral program** for customer acquisition

---

## Conclusion

Congratulations! You've successfully deployed your WDBC Distribution e-commerce website to Railway. Your site is now live, scalable, and ready to accept orders.

**Key Achievements:**
✅ Full-stack application deployed  
✅ MySQL database configured and seeded  
✅ Square payment integration working  
✅ Custom domain ready to connect  
✅ Admin dashboard accessible  
✅ Abandoned cart recovery set up  
✅ Recently viewed items tracking enabled  

**What's Next?**
- Monitor your Railway dashboard for performance metrics
- Test all features thoroughly before going live
- Set up backups and monitoring
- Start marketing your products!

**Need Help?**
- Check the Troubleshooting section above
- Join Railway Discord for community support
- Contact Square support for payment issues

Good luck with your business! 🚀

---

**Document Version:** 2.0  
**Last Updated:** December 14, 2024  
**Author:** Manus AI

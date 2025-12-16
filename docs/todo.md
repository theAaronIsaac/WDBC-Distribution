# Project TODO

## Database & Backend
- [x] Create products table with weight options (1g, 3g, 5g, 10g)
- [x] Create orders table with customer info and order details
- [x] Create order items table for cart items
- [x] Create shipping rates table for UPS/USPS options
- [x] Add tRPC procedures for product listing
- [x] Add tRPC procedures for cart management
- [x] Add tRPC procedures for order creation
- [x] Add tRPC procedures for shipping rate calculation
- [x] Add admin procedures for order management

## Frontend - Public Pages
- [x] Design attractive landing page with research disclaimer
- [x] Create product catalog page showing SR17018 in different weights
- [x] Implement shopping cart functionality
- [x] Build checkout page with customer information form
- [x] Add payment method selection (Zelle/BTC)
- [x] Implement shipping method selection (UPS/USPS options)
- [x] Create order confirmation page
- [x] Add "For Research Purposes Only" disclaimer throughout site

## Frontend - Admin Panel
- [x] Create admin dashboard for order management
- [x] Build order list view with status filters
- [x] Add order detail view
- [x] Implement order status update functionality

## Testing & Deployment
- [x] Write vitest tests for critical procedures
- [x] Test checkout flow end-to-end
- [x] Create checkpoint for deployment

## Pricing and Shipping Updates
- [x] Update product prices: 1g=$60, 3g=$180, 5g=$290, 10g=$490
- [x] Implement free UPS 2nd Day Air shipping for 3g, 5g, and 10g orders
- [x] Update checkout logic to apply free shipping automatically
- [x] Update tests to reflect new pricing

## Railway Deployment Preparation
- [x] Create railway.json configuration file
- [x] Create .railwayignore file
- [x] Update package.json with Railway build scripts
- [x] Create deployment guide document
- [x] Create environment variables template
- [x] Package all files for download

## Replace Manus OAuth with Email/Password Auth
- [x] Add password field to users table schema
- [x] Install bcrypt for password hashing
- [x] Create authentication procedures (login, register)
- [x] Create admin login page
- [x] Update admin dashboard to use new auth
- [x] Create admin setup script
- [x] Remove Manus OAuth dependencies
- [x] Update deployment guide with new auth setup
- [x] Test login/logout flow

## Stripe Payment Integration
- [x] Add Stripe feature to project
- [x] Create Stripe checkout session endpoint
- [x] Implement payment success/cancel pages
- [x] Add Stripe payment option to checkout flow
- [x] Test Stripe payments in test mode
- [x] Update order status after successful payment

## Payment Information Updates
- [x] Update Bitcoin wallet address to bc1qln37wa3029gwvka8p24pn8gjneu9kfffhlq04v

## Homepage Redesign - Two Category Layout
- [x] Update homepage hero section to identify as lab equipment supplier
- [x] Add "Lab Equipment Supplies" section with shop button
- [x] Add "Chemicals" section with shop button below equipment section
- [x] Update site branding/description to reflect dual category business
- [x] Test navigation flow for both categories

## Homepage Text Updates
- [x] Change "Professional Lab Equipment Supplier" to "Professional Lab Equipment Supplies"

## WDBC Distribution Homepage Redesign
- [x] Change main title to "WDBC distribution"
- [x] Add tagline "supplying inquiring minds"
- [x] Create four category blocks: Lab Wear, Chemicals, Consumables, Clearance
- [x] Update site branding to WDBC distribution

## Add Consumables Products
- [x] Add Cole-Parmer Transfer Pipette to database
- [x] Add B-D Disposable Syringe (Slip-Tip) to database
- [x] Add B-D Disposable Syringe (Luer-Lok) to database
- [x] Update product schema to support category field

## Replace Header with Logo
- [x] Copy WDBC logo image to project public folder
- [x] Update homepage to display logo instead of text header

## Update Color Scheme to Match Logo
- [x] Update primary color to WDBC logo blue (#3B5998 or similar)
- [x] Ensure proper contrast ratios for accessibility
- [x] Update all UI components to use new color scheme

## Blue Background Theme
- [x] Change website background from white to WDBC blue
- [x] Update text colors to white/light for proper contrast
- [x] Adjust card backgrounds for visibility

## Exact Color Matching and Clearance Styling
- [x] Extract exact background color from WDBC logo image and match website background
- [x] Change Clearance card/section to light red theme

## Category Landing Pages
- [x] Create Lab Ware category page with product listings
- [x] Create Consumables category page with product listings
- [x] Create Clearance category page with product listings
- [x] Add routes for all three category pages in App.tsx

## Text Color Improvements
- [x] Change light grey text in white containers to standard black for better readability

## Warning Box Improvements
- [x] Restore red warning boxes to original white background styling for better readability

## Checkout Layout Fixes
- [x] Fix shipping options pricing to align properly on the right side

## Product Variants Cleanup
- [x] Remove weight options from all products except SR17018 listings
- [x] Fix font color for free shipping banner text to improve readability

## Footer Updates
- [x] Change copyright text from "SR17018 Research Compound" to "BSR Innovations"

## Banner Text Improvements
- [x] Change "For Research Purposes Only" banner text color for better readability

## Header Logo Updates
- [x] Change header logo from beaker icon to microscope icon matching WDBC logo style

## Logo Color Update
- [x] Change header logo color to white for better visibility against blue background

## Lab Ware Inventory
- [x] Add beakers to Lab Ware category
- [x] Add flasks to Lab Ware category
- [x] Add pipettes to Lab Ware category

## Product Image Upload Feature
- [x] Add imageUrl field to products schema
- [x] Create image upload functionality for products
- [x] Add image display to product cards

## Icon Updates
- [x] Change High Quality icon to more fitting symbol (e.g., award, badge, star)
- [x] Match High Quality icon color with other bottom section icons

## Footer Contact Section
- [x] Create database schema for contact form submissions
- [x] Add backend tRPC procedures for contact form
- [x] Create reusable footer component with contact information
- [x] Add contact form with name, email, subject, and message fields
- [x] Display business email and phone number in footer
- [x] Update all pages to use new footer component

## Disposable Graduated Beakers
- [x] Add 15ml disposable graduated beaker
- [x] Add 30ml disposable graduated beaker
- [x] Add 50ml disposable graduated beaker
- [x] Add 100ml disposable graduated beaker
- [x] Add 150ml disposable graduated beaker
- [x] Add 250ml disposable graduated beaker
- [x] Add 400ml disposable graduated beaker
- [x] Add 600ml disposable graduated beaker

## Admin Management Features
- [x] Build /admin/orders page with full order management UI
- [x] Build /admin/contacts page for contact form management
- [x] Add logout button to admin navigation
- [x] Add product CRUD operations (create, edit, delete) to admin UI
- [x] Add admin notification preferences (contact form auto-notifies owner)
- [x] Update App.tsx with new admin routes
- [x] Update AdminDashboard navigation with new pages

## Consumable Products
- [x] Add universal filtered pipette tips (1000µl)
- [x] Add non-sterile graduated sample container (8 oz)
- [x] Add chromatography paper
- [x] Add filter paper

## Square Payment Integration
- [x] Add Square environment variables (Application ID, Access Token)
- [x] Install Square SDK npm package
- [x] Create Square payment backend procedures
- [x] Update checkout page with Square payment option
- [x] Update payment methods to include Square alongside Bitcoin
- [ ] Add Square Web Payments SDK frontend form (requires real credentials)
- [ ] Add payment verification and order confirmation flow
- [ ] Add Square payment documentation

## Product Filtering System
- [x] Add productType field to products schema (beakers, pipette_tips, paper, flasks, etc.)
- [x] Update existing products with appropriate product types
- [x] Add filtering UI to Lab Ware page
- [x] Add filtering UI to Consumables page
- [x] Add "Clear Filters" functionality
- [ ] Add filtering UI to Products page (main products page)
- [ ] Add filtering UI to Clearance page

## 404 Error on Published Site - Comprehensive Fix
- [x] Audit client-side routing (wouter configuration) - all routes correct
- [x] Verify server static file serving paths - dist/public structure correct
- [x] Check HTML5 history mode fallback - server fallback to index.html working
- [x] Verify production build output structure - all assets in correct locations
- [x] Test all routes in production mode locally - HTTP 200 OK confirmed
- [x] Add .manus.space to allowed hosts in vite.config.ts
- [x] Rebuild project with updated configuration

## Remove Stripe Payment Integration
- [x] Remove Stripe payment option from checkout page UI
- [x] Remove Stripe backend procedures from routers.ts
- [x] Uninstall Stripe npm package
- [x] Remove Stripe environment variables from documentation
- [x] Test checkout with Square, Zelle, and Bitcoin only

## Square Payment Testing
- [x] Create vitest test for Square payment creation
- [x] Verify Square credentials are configured (automated test failed due to Square Sandbox limitations)
- [x] Square credentials added and ready for live testing

## Square Web Payments SDK Implementation
- [x] Create backend tRPC procedure for processing Square payments
- [x] Load Square Web Payments SDK script on checkout page
- [x] Implement Square payment form UI with card input
- [x] Handle payment tokenization and submission
- [x] Add loading states and error handling for Square payments
- [x] Square checkout flow ready for testing

## Order Confirmation Page
- [x] Create OrderConfirmation page component with detailed order summary
- [x] Display payment status, order number, and customer information
- [x] Show itemized order details with pricing breakdown
- [x] Add shipping information and estimated delivery
- [x] Include next steps and contact information
- [x] Route already exists in App.tsx

## Automated Email Notifications
- [x] Create email notification helper function using Manus notification API
- [x] Design HTML email template for order confirmation
- [x] Include order details, items, shipping info, and payment status in email
- [x] Integrate email sending after successful order creation
- [x] Email notifications ready for testing

## Abandoned Cart Recovery
- [x] Create database schema for tracking abandoned carts
- [x] Implement cart capture when user starts checkout
- [x] Build scheduled job to check for abandoned carts (24+ hours old)
- [x] Create HTML email template for cart recovery
- [x] Send reminder emails with direct checkout link
- [x] Track recovery email sent status to avoid duplicates

## Inventory Management System
- [x] Add stockQuantity field to products table
- [x] Add lowStockThreshold field to products table
- [x] Implement automatic stock decrement when orders are placed
- [x] Create admin UI for managing stock levels
- [x] Add low-stock warning indicators in admin panel
- [x] Prevent orders when stock is insufficient

## Advanced Order Filtering & Export
- [x] Create backend procedure for filtering orders by date range
- [x] Add filtering by payment status and fulfillment status
- [x] Build CSV export functionality for filtered orders
- [x] Create filter UI in admin orders page
- [x] Add date range picker for order filtering
- [x] Implement export to CSV button with download

## Low-Stock Email Alerts
- [x] Create email notification function for low-stock alerts
- [x] Integrate alert into stock decrement logic
- [x] Send alert to owner when product drops below threshold
- [x] Include product details and current stock level in alert


## Remove Zelle Payment Option
- [x] Remove Zelle from checkout page UI and TypeScript types
- [x] Update database schema to remove Zelle from payment method enum
- [x] Migrate existing Zelle orders to Bitcoin in database
- [x] Remove Zelle from order confirmation page
- [x] Remove Zelle from email notification templates
- [x] Update backend routers to remove Zelle from validation
- [x] Update test files to remove Zelle test cases

## Update Contact Email Addresses
- [x] Find all placeholder email addresses in codebase
- [x] Replace emails in Footer component
- [x] Replace emails in contact forms
- [x] Replace emails in email templates
- [x] Replace emails in OrderConfirmation page

## Complete Checkout Testing
- [x] Verify Square sandbox credentials are configured
- [x] Test adding products to cart
- [x] Test checkout form validation
- [x] Test shipping calculation with different methods
- [x] Fixed Square SDK URL from sandbox-web to web.squarecdn.com
- [x] Retested after owner updated Square permissions - still failing
- [x] Attempted Bitcoin payment - 400 error during order creation
- [ ] BLOCKED: Square payment form not loading despite permission updates
- [ ] BLOCKED: Bitcoin payment failing with 400 error (backend validation issue)
- [ ] Verify order confirmation page displays correctly (blocked)
- [ ] Verify email notifications are sent (blocked)
- [ ] Verify inventory is decremented after order (blocked)

## Recently Viewed Items Feature
- [ ] Create database schema for tracking product views
- [ ] Implement backend procedures for recording product views
- [ ] Implement backend procedure for retrieving recently viewed items
- [ ] Add view tracking to Products page when user clicks on a product
- [ ] Create RecentlyViewedItems component for homepage
- [ ] Display recently viewed items section on homepage
- [ ] Limit to 4-6 most recent items
- [ ] Test recently viewed functionality

## Recently Viewed Items Feature
- [x] Create database schema for tracking recently viewed products
- [x] Implement backend procedures for recording product views
- [x] Implement backend procedures for retrieving recently viewed items
- [x] Add view tracking to Products page when adding items to cart
- [x] Create RecentlyViewedItems component for homepage
- [x] Display up to 6 most recent unique products
- [x] Add session tracking using localStorage
- [x] Test and verify feature is working correctly

## Square Sandbox URL Fix
- [x] Update Square SDK URL to use sandbox URL (https://sandbox.web.squarecdn.com/v1/square.js)
- [x] Test Square payment form initialization with correct sandbox URL
- [ ] Payment form still not loading - likely due to unclaimed sandbox account
- [ ] User needs to verify Square sandbox credentials at: https://developer.squareup.com/apps

## Remove Stripe References and Fix Square URLs
- [x] Search for all Stripe mentions in project files
- [x] Replace incorrect Stripe URLs with correct Square URLs
- [x] Update documentation to reference Square Developer Dashboard
- [x] Verify all Square configuration is correct

## Published Site Troubleshooting (bsrinnovations.manus.space)
- [x] Navigate to published site and identify issues
- [x] Check browser console for errors
- [x] Found root cause: Production server looking for static files in wrong directory
- [x] Fixed: Updated server/_core/vite.ts distPath from "public" to "../../dist/public"
- [ ] Save checkpoint and republish
- [ ] Verify site works correctly after fixes

## Persistent 404 Error Investigation
- [x] Verify current published site error state
- [x] Check if build process is working correctly
- [x] Investigate package.json build scripts
- [x] Test local production build
- [x] Identified root cause: import.meta.dirname doesn't work in bundled esbuild code
- [x] Fixed: Changed to process.cwd() for production path resolution
- [x] Tested: Production server now serves website correctly
- [ ] Save checkpoint and republish

## Manus Deployment System Investigation
- [ ] Check for Manus-specific deployment configuration files
- [ ] Verify package.json start script is correct for Manus platform
- [ ] Check if there are any hidden deployment settings
- [ ] Compare local production build vs Manus deployment
- [ ] Document the issue for Manus support

## Update Contact Information
- [x] Find all instances of contact email and phone number
- [x] Change email to Support@wdbcenterprises.com
- [x] Remove phone number references
- [x] Test contact form and display
- [ ] Save checkpoint

## Improve Text Contrast in Get in Touch Section
- [x] Identify text with poor contrast against blue background
- [x] Update text colors to be lighter/brighter (white headings, gray-200 body text)
- [x] Test visibility improvements
- [ ] Save checkpoint

## Fix Square Payment Form Initialization Error
- [x] Investigate SquarePaymentForm component for null element reference
- [x] Fix DOM element timing issue (split into two useEffect hooks)
- [x] Test Square payment form - no more null element error!
- [x] Note: Form still shows "Loading" due to Square credential/SDK issue (separate from null error)
- [ ] Save checkpoint

## Update Railway Deployment Guide
- [x] Review current deployment guide
- [x] Add Square credential migration instructions
- [x] Update environment variables section with all recent additions
- [x] Add section on transferring database data
- [x] Include troubleshooting for common deployment issues
- [x] Update product catalog and features list
- [x] Add post-deployment tasks for abandoned cart recovery
- [ ] Save checkpoint

## Test Admin Dashboard Functionality
- [ ] Create test admin account
- [ ] Test login functionality
- [ ] Test product management (add, edit, view, delete)
- [ ] Test order management and status updates
- [ ] Test inventory management features
- [ ] Test contact form viewing
- [ ] Document any issues found
- [ ] Save checkpoint with fixes if needed

## Complete Admin Dashboard Testing
- [ ] Test admin login with test credentials
- [ ] Verify dashboard loads after successful login
- [ ] Test product management - view product list
- [ ] Test product management - add new product
- [ ] Test product management - edit existing product
- [ ] Test product management - delete product
- [ ] Test product management - upload product image
- [ ] Test order management - view order list
- [ ] Test order management - filter orders by status
- [ ] Test order management - update order status
- [ ] Test order management - add tracking number
- [ ] Test inventory management - view stock levels
- [ ] Test inventory management - update stock quantities
- [ ] Test inventory management - low stock warnings
- [ ] Test contact management - view contact submissions
- [ ] Test logout functionality
- [ ] Document all test results
- [ ] Save final checkpoint

## Comprehensive Inventory System Testing
- [ ] Review inventory schema and database structure
- [ ] Test inventory backend procedures with SQL queries
- [ ] Verify stock decrement logic when orders are placed
- [ ] Test low-stock alert functionality
- [ ] Review admin UI inventory management code
- [ ] Test complete inventory workflow scenarios
- [ ] Document all test results in comprehensive report

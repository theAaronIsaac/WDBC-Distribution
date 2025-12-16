# SR17018 Static Website - Deployment Guide

This is a simple, static website for SR17018 Research Compound. It contains only HTML and CSS - no backend, no database, no complex setup.

## What's Included

- `index.html` - Main website page
- `style.css` - Stylesheet
- This deployment guide

## Deployment Options

### Option 1: Netlify (Recommended - FREE)

**Steps:**

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the entire folder (or just index.html and style.css)
4. Your site will be live instantly at a netlify.app URL
5. To use your custom domain (BSRInnovations.com):
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow DNS setup instructions

**Cost:** FREE

---

### Option 2: Vercel (FREE)

**Steps:**

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Upload your files or connect a GitHub repo
4. Deploy
5. Configure custom domain in project settings

**Cost:** FREE

---

### Option 3: GitHub Pages (FREE)

**Steps:**

1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository name
d `sr17018-website`
3. Upload `index.html` and `style.css`
4. Go to Settings → Pages
5. Select branch (usually `main`) and root folder
6. Your site will be at `username.github.io/sr17018-website`

**Cost:** FREE

---

### Option 4: Any Web Hosting

You can upload these files to any web hosting service:

1. Get hosting (GoDaddy, Hostinger, Bluehost, etc.)
2. Upload files via FTP or file manager
3. Place files in public_html or www folder
4. Access via your domain

---

## Custom Domain Setup (BSRInnovations.com)

### For Netlify/Vercel:

1. In your hosting dashboard, go to Domain settings
2. Add `bsrinnovations.com`
3. You'll get DNS records (usually CNAME or A records)
4. Go to your domain registrar (Namecheap, GoDaddy, etc.)
5. Add the DNS records provided
6. Wait 15 minutes to 48 hours for DNS propagation

### Example DNS Records:

```
Type: CNAME
Host: www
Value: your-site.netlify.app

Type: A
Host: @
Value: (IP provided by host)
```

---

## Updating Your Website

To make changes:

1. Edit `index.html` or `style.css` locally
2. Re-upload to your hosting service
3. Changes appear immediately (or after cache cl
ear)

---

## Customization Tips

### Update Payment Information

Edit `index.html` and find the contact section:

```html
<p><strong>Zelle:</strong> your-email@example.com</p>
<p><strong>Bitcoin (BTC):</strong> your-btc-address</p>
```

Replace with your actual payment details.

### Change Colors

Edit `style.css` to change the color scheme:

```css
/* Header gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Product cards */
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
```

### Add Contact Email

Add an email link in the contact section:

```html
<p><strong>Email:</strong> <a href="mailto:orders@bsrinnovations.com">orders@bsrinnovations.com</a></p>
```

---

## Support

This is a static website with no backend. All order processing must be done manually via email/Zelle/Bitcoin.

**Advantages:**
- ✅ FREE hosting
- ✅ No maintenance
- ✅ Fast loading
- ✅ No security concerns

- ✅ Works everywhere

**Limitations:**
- ❌ No shopping cart
- ❌ No order tracking
- ❌ Manual order processing

---

## Next Steps

1. Download all files
2. Choose a hosting platform (Netlify recommended)
3. Upload and deploy
4. Configure custom domain
5. Update payment information
6. Share your website!

Your SR17018 website is ready to go live! 🚀

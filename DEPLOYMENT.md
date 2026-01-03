# Deployment Guide - Chloride RV Park Website

This guide will help you deploy your RV Park website to various hosting platforms.

## Pre-Deployment Checklist

Before deploying, make sure you've completed these tasks:

- [ ] Update phone number (search for `+1-555-RV-PARKS`)
- [ ] Update email address (replace `info@chloridervpark.com`)
- [ ] Update physical address in Location and Footer sections
- [ ] Update Google Maps coordinates
- [ ] Replace placeholder images with actual photos
- [ ] Test contact form
- [ ] Test all navigation links
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (target 90+)
- [ ] Verify all content is accurate

## Option 1: Deploy to Netlify (Recommended)

Netlify offers free hosting with HTTPS, continuous deployment, and form handling.

### Method A: Deploy from Git (Best for ongoing updates)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Chloride RV Park website"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository
   - Configure build settings:
     - **Build command**: Leave empty
     - **Publish directory**: `/` or `.`
   - Click "Deploy site"

3. **Configure Domain (Optional)**
   - Go to Site settings → Domain management
   - Add custom domain or use Netlify subdomain
   - HTTPS is automatically enabled

4. **Enable Form Handling (Optional)**
   - Forms are automatically detected by Netlify
   - Add `data-netlify="true"` to your form tag
   - View submissions in Netlify dashboard

### Method B: Manual Deploy (Quick one-time deployment)

1. **Drag and Drop**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag your project folder to the drop zone
   - Your site will be live in seconds

2. **CLI Deploy**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy
   # Follow prompts, then:
   netlify deploy --prod
   ```

## Option 2: Deploy to Vercel

Vercel is another excellent option with similar features to Netlify.

### Deploy from Git

1. **Push to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Other
     - **Build Command**: Leave empty
     - **Output Directory**: Leave empty
   - Click "Deploy"

### Deploy with CLI

```bash
npm i -g vercel
vercel login
vercel
# Follow prompts, then:
vercel --prod
```

## Option 3: Deploy to GitHub Pages

Free hosting directly from your GitHub repository.

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Under "Source", select branch: `main`
   - Select folder: `/` (root)
   - Click "Save"

3. **Access Your Site**
   - Site will be available at: `https://USERNAME.github.io/REPO-NAME/`
   - May take a few minutes to deploy

**Note**: GitHub Pages doesn't support server-side form handling. Use Formspree or similar service.

## Option 4: Deploy to CloudFlare Pages

Fast, free hosting with global CDN.

### Steps

1. **Push to GitHub** (if not already done)

2. **Create CloudFlare Pages Project**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect GitHub account
   - Select repository
   - Configure:
     - **Build command**: Leave empty
     - **Build output directory**: `/`
   - Click "Save and Deploy"

## Option 5: Traditional Web Hosting

If you have traditional shared hosting (cPanel, etc.)

### Via FTP/SFTP

1. **Connect via FTP Client** (FileZilla, Cyberduck, etc.)
   - Host: your-domain.com
   - Username: your-ftp-username
   - Password: your-ftp-password

2. **Upload Files**
   - Upload all files to `public_html` or `www` directory
   - Ensure `index.html` is in the root directory

3. **Verify**
   - Visit your domain
   - Check all links and forms work

### Via cPanel File Manager

1. Log into cPanel
2. Open File Manager
3. Navigate to `public_html`
4. Upload all files
5. Extract if zipped

## Post-Deployment Tasks

After deploying to any platform:

### 1. Enable HTTPS

Most platforms enable this automatically. If not:
- Netlify/Vercel: Automatic
- GitHub Pages: Automatic (may take time)
- CloudFlare: Automatic
- Traditional hosting: Request SSL certificate from host

### 2. Configure Form Handler

Choose one of these options:

**Formspree** (Easiest)
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Netlify Forms** (if using Netlify)
```html
<form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
```

**Custom Backend**
- Set up API endpoint
- Update fetch URL in `js/script.js`

### 3. Set Up Analytics

**Google Analytics**
1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get tracking ID (G-XXXXXXXXXX)
3. Add to `index.html` before `</head>`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

**Plausible** (Privacy-friendly alternative)
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### 4. Submit to Google

**Google Search Console**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property (your domain)
3. Verify ownership
4. Submit sitemap (optional for single-page)

**Google My Business**
1. Create/claim listing at [business.google.com](https://business.google.com)
2. Add RV park details
3. Add photos
4. Link to website

### 5. Configure Custom Domain (Optional)

Most platforms support custom domains:

1. **Buy domain** (Namecheap, Google Domains, etc.)

2. **Update DNS settings**:
   - Netlify: Add A records and CNAME
   - Vercel: Add A records and CNAME
   - GitHub Pages: Add CNAME file with domain name

3. **Enable HTTPS** (usually automatic)

## Performance Testing

After deployment, test your site:

### Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Run audit
4. Target scores: 90+ in all categories

### Other Testing Tools

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

## Maintenance and Updates

### Making Changes

**If deployed from Git**:
```bash
# Make changes to files
git add .
git commit -m "Update content"
git push
# Changes deploy automatically
```

**If manually deployed**:
- Make changes locally
- Re-upload changed files via FTP or re-deploy

### Backup

Always keep a local copy of your files:
```bash
git clone YOUR_REPO_URL backup-YYYY-MM-DD
```

## Troubleshooting

### Site Not Loading
- Check DNS propagation (can take 24-48 hours)
- Verify files uploaded to correct directory
- Check browser console for errors

### Forms Not Working
- Verify form handler is configured
- Check for JavaScript errors
- Test with valid email format

### Images Not Loading
- Check image paths (relative vs absolute)
- Verify images uploaded
- Check file permissions (if traditional hosting)

### HTTPS Not Working
- Wait for SSL certificate to provision (can take hours)
- Force HTTPS in hosting settings
- Clear browser cache

## Support Resources

- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Pages**: [pages.github.com](https://pages.github.com)
- **CloudFlare**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)

## Quick Deployment Commands

```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod

# GitHub Pages (automatic on push)
git push origin main

# FTP (example with lftp)
lftp -u username,password ftp.yourhost.com -e "mirror -R /local/path /remote/path; quit"
```

---

**Need Help?** Check the main README.md or contact support.

# Chloride RV Park Website

A modern, responsive single-page marketing website for an RV Park in Chloride, Arizona.

## Overview

This is a conversion-focused, single-page website designed to attract visitors and convert them into calls, inquiries, or booking actions. The site establishes legitimacy, location clarity, and showcases amenities at a glance.

**Live Site:** [Add your deployment URL here]

## Features

- **Fully Responsive**: Mobile-first design that works on all devices
- **Single-Page Layout**: Smooth scrolling between sections
- **SEO Optimized**: Meta tags, schema markup, and semantic HTML
- **Performance Focused**: Lazy loading images, optimized assets
- **Contact Form**: Client-side validation with spam protection
- **Accessibility**: WCAG AA compliant with semantic HTML
- **Modern Design**: Desert-themed color palette with clean aesthetics

## Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: TailwindCSS via CDN + custom styles
- **JavaScript**: Vanilla JS (no frameworks)
- **Responsive**: Mobile-first approach

### Hosting
- **Recommended**: Netlify, Vercel, or GitHub Pages
- **Requirements**: Static hosting with HTTPS

## Project Structure

```
rvwebsite/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom CSS styles
├── js/
│   └── script.js       # JavaScript functionality
├── images/             # Image assets (currently using Unsplash CDN)
├── README.md           # This file
└── netlify.toml        # Netlify configuration (optional)
```

## Sections

1. **Hero** - Eye-catching header with primary CTAs
2. **About the Park** - Trust-building information
3. **Amenities** - Icon grid showcasing park features
4. **Rates / Stays** - Pricing information
5. **Location & Map** - Embedded Google Maps and directions
6. **Contact** - Phone, email, and inquiry form
7. **Footer** - Additional contact info and links

## Getting Started

### Prerequisites

No build tools required! This is a static website that runs directly in the browser.

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rvwebsite
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Python 3
     python -m http.server 8000

     # Node.js (if you have http-server installed)
     npx http-server

     # PHP
     php -S localhost:8000
     ```

3. **View the site**
   - Open `http://localhost:8000` in your browser

## Customization

### Update Contact Information

Edit `index.html` and replace:

- **Phone Number**: Search for `+1-555-RV-PARKS` and replace with actual number
- **Email**: Replace `info@chloridervpark.com`
- **Address**: Update the address in the Location and Footer sections
- **Google Maps**: Update the map embed coordinates in the Location section

### Change Colors

The color palette is defined in the TailwindCSS configuration in `index.html`:

```javascript
colors: {
    sand: '#E8D5B7',
    rust: '#B7410E',      // Primary brand color
    sage: '#9CAF88',
    charcoal: '#2C2C2C',  // Text color
}
```

### Update Images

Replace the Unsplash placeholder images with your own:

1. Add images to the `/images` folder
2. Update image `src` attributes in `index.html`
3. Optimize images (WebP format recommended)
4. Ensure alt text is descriptive for accessibility

### Modify Form Handling

The contact form currently uses client-side validation only. To connect it to a backend:

**Option 1: Formspree**
```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

**Option 2: Netlify Forms**
```html
<form name="contact" method="POST" data-netlify="true">
```

**Option 3: Custom Backend**
- Update the fetch URL in `js/script.js` (line ~150)
- Replace the setTimeout with actual API call

## Deployment

### Deploy to Netlify

1. **Via Git (Recommended)**
   - Push your code to GitHub
   - Connect repository to Netlify
   - Deploy settings:
     - Build command: (leave empty)
     - Publish directory: `/`
   - Enable HTTPS and custom domain

2. **Via Drag & Drop**
   - Log in to Netlify
   - Drag the project folder to the deploy area
   - Configure domain and HTTPS

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow prompts to complete deployment

### Deploy to GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch (usually `main`)
4. Select folder: `/` (root)
5. Save and wait for deployment

## Performance Optimization

Current optimizations:
- ✅ Lazy loading images
- ✅ TailwindCSS via CDN (no build required)
- ✅ Minified production-ready code
- ✅ Optimized image formats (WebP via Unsplash)
- ✅ Efficient CSS and JavaScript

**Target Lighthouse Scores: 90+**

To improve further:
1. Replace Unsplash URLs with optimized local images
2. Add service worker for offline support
3. Implement image preloading for hero section
4. Consider self-hosting fonts

## SEO Checklist

- ✅ Meta title and description
- ✅ H1 tag (one per page)
- ✅ Alt text on all images
- ✅ Semantic HTML structure
- ✅ Schema.org LocalBusiness markup
- ✅ Mobile responsive
- ✅ Fast loading time
- ✅ HTTPS enabled (when deployed)

### Additional SEO Steps

1. **Submit to Google Search Console**
2. **Create Google My Business listing**
3. **Add sitemap.xml** (optional for single-page sites)
4. **Set up Google Analytics** (code ready in script.js)

## Analytics Setup

The site is ready for analytics tracking. To enable:

### Google Analytics

1. Create GA4 property
2. Add tracking code to `index.html` before closing `</head>`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

3. Uncomment tracking events in `js/script.js`

### Plausible Analytics (Privacy-Friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- WCAG AA compliant
- Semantic HTML
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Reduced motion support

## Testing

### Manual Testing Checklist

- [ ] All navigation links work
- [ ] Mobile menu opens/closes correctly
- [ ] Smooth scrolling functions
- [ ] Contact form validates inputs
- [ ] Phone links work on mobile
- [ ] Email links open mail client
- [ ] Google Maps loads correctly
- [ ] All images load properly
- [ ] Site is responsive on all screen sizes

### Lighthouse Audit

Run in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

Target scores: 90+ in all categories

## Troubleshooting

### Images Not Loading
- Check image paths
- Ensure images are in `/images` folder
- Verify image URLs are correct

### Form Not Submitting
- Check browser console for errors
- Ensure form handler is configured
- Test with valid email format

### Mobile Menu Not Working
- Check JavaScript is loading
- Verify button IDs match script
- Clear browser cache

## Future Enhancements

Potential additions (currently out of scope):
- Online booking system
- User accounts
- CMS integration
- Multi-page expansion
- Payment processing
- Image gallery with lightbox
- Customer testimonials
- Blog section
- Availability calendar

## License

This project is private and proprietary. All rights reserved.

## Support

For questions or issues:
- Email: [Your email]
- Phone: [Your phone]

## Credits

- **Development**: [Your name/company]
- **Images**: Unsplash (placeholder images)
- **Icons**: Heroicons (via Tailwind)
- **Fonts**: Google Fonts (Inter)

## Changelog

### Version 1.0.0 (2026-01-03)
- Initial release
- Single-page responsive design
- Contact form with validation
- SEO optimization
- Google Maps integration

---

**Note**: Remember to update placeholder content (phone numbers, email addresses, images) before going live!

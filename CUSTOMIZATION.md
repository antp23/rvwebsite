# Customization Guide - Chloride RV Park Website

This guide will help you customize the website to match your specific RV park details.

## Essential Customizations (Required Before Launch)

### 1. Contact Information

#### Phone Number
**Location**: Multiple places throughout the site

Search for: `+1-555-RV-PARKS`

Replace in:
- `index.html` (lines with `tel:+1-555-RV-PARKS`)
- Hero section CTA button
- Contact section
- Footer
- Schema markup (around line 58)

**Example**:
```html
<!-- Before -->
<a href="tel:+1-555-RV-PARKS">

<!-- After -->
<a href="tel:+1-928-555-1234">
```

#### Email Address
**Location**: Multiple places

Search for: `info@chloridervpark.com`

Replace in:
- Contact section
- Footer
- Meta tags

#### Physical Address
**Location**: Footer and Contact sections

Search for: `Historic Chloride` and `Chloride, AZ 86431`

Update with your actual address.

### 2. Google Maps Integration

**Location**: `index.html` - Location section (around line 550)

**Current iframe**:
```html
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51689.89!2d-114.1969!3d35.4042..."
```

**To get your custom embed code**:
1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your RV park address
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the entire iframe in the HTML

**Also update the "Get Directions" link**:
```html
<!-- Update the destination parameter -->
<a href="https://www.google.com/maps/dir/?api=1&destination=YOUR_ADDRESS_HERE">
```

### 3. Schema Markup (SEO)

**Location**: `index.html` - Head section (around line 55)

Update these fields:
```json
{
  "name": "Chloride Desert RV Park",          // Your park name
  "telephone": "+1-555-RV-PARKS",             // Your phone
  "address": {
    "streetAddress": "Historic Chloride",      // Your street address
    "addressLocality": "Chloride",            // Your city
    "addressRegion": "AZ",                    // Your state
    "postalCode": "86431"                     // Your ZIP
  },
  "geo": {
    "latitude": "35.4042",                    // Your latitude
    "longitude": "-114.1969"                  // Your longitude
  }
}
```

**To find your coordinates**:
1. Google Maps → Right-click your location
2. Click the coordinates to copy them

## Content Customization

### 4. Park Name and Branding

**Main Brand Name**: Search for `Chloride RV Park` or `Chloride Desert RV Park`

Replace in:
- Header logo (line ~85)
- Footer (line ~650)
- Page title
- Schema markup

### 5. Hero Section

**Location**: `index.html` - Hero section (around line 130)

**Headline** (H1):
```html
<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
    Quiet Desert RV Living in<br>Historic Chloride, Arizona
</h1>
```

**Subheadline**:
```html
<p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-desert-100">
    Full hookups, long-term stays, and unmatched desert views
</p>
```

Customize both to match your unique selling proposition.

### 6. About Section Text

**Location**: `index.html` - About section (around line 170)

Update the two paragraphs to describe your specific park:
- History
- Location benefits
- Target audience (snowbirds, retirees, etc.)
- Unique features

### 7. Amenities

**Location**: `index.html` - Amenities section (around line 200)

**To add/remove amenities**:

Each amenity is a card like this:
```html
<div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
    <div class="text-rust mb-4">
        <!-- SVG icon here -->
    </div>
    <h3 class="text-xl font-bold text-charcoal mb-2">Amenity Title</h3>
    <p class="text-gray-600">Description here</p>
</div>
```

**Common amenities to consider**:
- WiFi
- Laundry facilities
- Restrooms/showers
- Dump station
- Propane
- Picnic areas
- Recreation room
- Security
- On-site management

**Free SVG icons**: [Heroicons](https://heroicons.com/)

### 8. Rates

**Location**: `index.html` - Rates section (around line 350)

Update pricing in these sections:
```html
<div class="text-4xl font-bold text-rust mb-2">$35</div>  <!-- Nightly rate -->
<div class="text-4xl font-bold text-rust mb-2">$210</div> <!-- Weekly rate -->
<div class="text-4xl font-bold text-rust mb-2">$750</div> <!-- Monthly rate -->
```

**Update the rate notes** (around line 420):
- Utilities included/not included
- Deposit requirements
- Additional fees
- Discounts

### 9. Nearby Attractions

**Location**: `index.html` - Location section (around line 560)

Update the list of nearby attractions:
```html
<li class="flex items-start gap-2">
    <span class="text-rust mt-1">✓</span>
    <span><strong>Attraction Name</strong> - Description (distance)</span>
</li>
```

Add attractions relevant to your location.

## Visual Customization

### 10. Colors and Branding

**Location**: `index.html` - Head section (around line 35)

**Color palette**:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                sand: '#E8D5B7',      // Light tan
                rust: '#B7410E',      // Primary brand color (orange-red)
                sage: '#9CAF88',      // Accent green
                charcoal: '#2C2C2C',  // Dark gray for text
                desert: {
                    100: '#F5EBE0',   // Lightest
                    200: '#E8D5B7',
                    300: '#D4A574',
                    400: '#B7410E',   // Darkest
                }
            }
        }
    }
}
```

**To change the primary color**:
- Update the `rust` value (e.g., `#008B8B` for teal)
- This affects buttons, icons, and accents throughout the site

### 11. Images

**Current images**: Using Unsplash CDN placeholders

**To use your own images**:

1. **Optimize images first**:
   - Use WebP format when possible
   - Compress images (use [TinyPNG](https://tinypng.com/))
   - Recommended sizes:
     - Hero: 2000x1200px
     - About section: 800x600px
     - Amenity icons: Use SVG

2. **Add images to project**:
   ```
   images/
   ├── hero-bg.webp
   ├── about-1.webp
   ├── about-2.webp
   └── about-3.webp
   ```

3. **Update image sources**:
   ```html
   <!-- Before -->
   <img src="https://images.unsplash.com/photo-..." alt="...">

   <!-- After -->
   <img src="images/hero-bg.webp" alt="Desert RV Park view">
   ```

4. **Update all alt text** to describe YOUR specific images

**Hero background image** (around line 135):
```html
<img
    src="images/hero-bg.webp"
    alt="Chloride RV Park with mountain views"
    class="w-full h-full object-cover"
    loading="lazy"
>
```

### 12. Fonts

**Current font**: Inter (Google Fonts)

**To change font**:

1. **Choose font**: [Google Fonts](https://fonts.google.com/)

2. **Update in HTML head** (around line 47):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@300;400;600;700&display=swap" rel="stylesheet">
   ```

3. **Update Tailwind config** (around line 42):
   ```javascript
   fontFamily: {
       sans: ['Your Font Name', 'system-ui', 'sans-serif'],
   }
   ```

## Form Customization

### 13. Contact Form Setup

**Location**: `index.html` - Contact section (around line 600)

**Option A: Formspree** (Easiest)

1. Sign up at [Formspree.io](https://formspree.io/)
2. Create form, get form ID
3. Update form tag:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Remove JavaScript form handling or keep for validation

**Option B: Netlify Forms**

1. Add attribute to form tag:
   ```html
   <form id="contact-form" name="contact" method="POST" data-netlify="true">
   ```
2. View submissions in Netlify dashboard

**Option C: Custom Backend**

Update fetch URL in `js/script.js` (around line 150)

### 14. Form Fields

**To add/remove fields**:

Example - Adding "RV Length" field:
```html
<div>
    <label for="rv-length" class="block text-sm font-semibold text-charcoal mb-2">
        RV Length
    </label>
    <input
        type="text"
        id="rv-length"
        name="rv-length"
        class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-rust focus:border-transparent outline-none transition"
        placeholder="e.g., 35 feet"
    >
</div>
```

## SEO Customization

### 15. Meta Tags

**Location**: `index.html` - Head section (lines 8-12)

```html
<title>RV Park in Chloride AZ | Long-Term Desert RV Stays</title>
<meta name="description" content="Your custom description here (155 chars max)">
<meta name="keywords" content="Your, Keywords, Here">
```

**Tips for meta description**:
- 150-155 characters max
- Include location
- Include main benefit
- Include call to action

### 16. Sitemap and Robots.txt

**Update sitemap.xml**:
- Replace `https://yourdomain.com/` with your actual domain
- Update `<lastmod>` dates when you make changes

**Update robots.txt**:
- Replace `https://yourdomain.com/sitemap.xml` with your actual domain

## Analytics Setup

### 17. Google Analytics

**Location**: `index.html` - Add before closing `</head>` tag

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your tracking ID from Google Analytics.

## Testing Your Changes

After making changes:

1. **Open `index.html` in browser**
2. **Test all sections**:
   - Click all navigation links
   - Test mobile menu
   - Submit contact form
   - Click phone/email links
   - Test on mobile device
3. **Validate HTML**: [validator.w3.org](https://validator.w3.org/)
4. **Check accessibility**: [wave.webaim.org](https://wave.webaim.org/)
5. **Test performance**: Chrome DevTools → Lighthouse

## Quick Reference: File Locations

| What to Update | File | Approximate Line |
|---------------|------|------------------|
| Phone number | index.html | Multiple (search for "+1-555") |
| Email | index.html | Multiple (search for "info@") |
| Park name | index.html | Lines 85, 650+ |
| Hero text | index.html | Lines 130-145 |
| About section | index.html | Lines 170-190 |
| Amenities | index.html | Lines 200-330 |
| Rates | index.html | Lines 350-420 |
| Colors | index.html | Lines 35-45 |
| Form handler | index.html | Line 600 |
| Images | index.html | Multiple (search for "unsplash") |
| SEO meta tags | index.html | Lines 8-15 |
| Schema markup | index.html | Lines 55-75 |

## Common Issues

**Problem**: Colors not changing
- **Solution**: Clear browser cache (Ctrl+Shift+R)

**Problem**: Images not loading
- **Solution**: Check file paths, ensure images folder exists

**Problem**: Form not submitting
- **Solution**: Set up form handler (Formspree/Netlify)

**Problem**: Mobile menu not working
- **Solution**: Check JavaScript console for errors

## Need Help?

Refer to:
- README.md for general information
- DEPLOYMENT.md for deployment instructions
- Check browser console (F12) for JavaScript errors

---

**Pro Tip**: Make changes incrementally and test after each change. Keep a backup before making major modifications!

# Favicon Setup Instructions

## Files Needed:

I've added `logo-new.png` to the assets folder. To complete favicon setup:

### Option 1: Use Favicon Generator (Recommended)

1. Go to https://realfavicongenerator.net
2. Upload: `/assets/logo-new.png`
3. Download the generated package
4. Extract files to project root

This will create:
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`

### Option 2: Manual (Basic)

Add to `<head>` of all HTML files:

```html
<link rel="icon" type="image/png" href="/assets/logo-new.png">
<link rel="apple-touch-icon" href="/assets/logo-new.png">
```

## Apply to All Pages:

Add this to the `<head>` section of:
- index.html
- browse.html
- handle.html
- sign-up.html
- sign-in.html
- onboarding.html
- inbox.html
- All other HTML files

## Example:

```html
<head>
  <meta charset="utf-8">
  <title>Opento — Your personal agent</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  
  <link rel="stylesheet" href="styles.css">
</head>
```

---

For now, the logo is in `/assets/logo-new.png` and can be used until proper favicons are generated.

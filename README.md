# Crazy Harry’s Ingredient Par & Order List

A mobile-first Progressive Web App (PWA) for Crazy Harry’s Steakhouse. Chefs can fill out the current master ingredient par list with dropdown quantities, mark items that need ordering, create a copy-ready text document for a boss, and export the full par sheet as CSV.

## Features

- Phone-friendly layout with large touch targets.
- Collapsible sections matching the current master par list: bakery, protein, dairy/eggs, produce, pantry, oils/vinegars/liquids/alcohol, and frozen.
- Dropdown `Par`, `On Hand`, and `Order Qty` fields for every ingredient.
- Optional `Vendor Notes` field and `Needs Ordering` checkbox for quick item selection.
- Search/filter box for ingredients or section names.
- `Create Text Document` builds a copy-ready text message/email draft with only checked `Needs Ordering` items and their order quantities, keeps that draft updated as order selections change, and `Copy Text` copies it to the clipboard.
- `Export CSV` downloads the full worksheet.
- `Save Progress` plus autosave to `localStorage` so counts remain on the same phone/browser.
- Installable PWA with `manifest.json` and `service-worker.js` for home-screen use and offline loading after the first visit.

## Local Preview

Because the app uses a service worker, preview it through a local web server instead of opening `index.html` directly.

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment

This project is ready to deploy as a static website. There is no build step: `index.html`, `styles.css`, `app.js`, `manifest.json`, `service-worker.js`, and `icon.svg` are served directly from the repository root.

### GitHub Pages

A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. To publish the site:

1. Push the repository to GitHub on the `main` branch.
2. In GitHub, go to **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` or run the **Deploy static site to GitHub Pages** workflow manually from the **Actions** tab.
5. After the workflow finishes, open the provided Pages URL on a phone.
6. Use the browser share/menu option and choose **Add to Home Screen** to install the PWA.

The `.nojekyll` file is included so GitHub Pages serves every static asset exactly as checked in.

### Other Static Hosts

The app can also be deployed to static hosts such as Netlify, Vercel, Cloudflare Pages, or any basic web server. Use the repository root as the publish directory and leave the build command blank.

## File Structure

```text
.github/workflows/deploy.yml  # GitHub Pages deployment workflow
.nojekyll           # Ensures GitHub Pages serves static files without Jekyll processing
index.html          # App markup and templates
styles.css          # Mobile-first steakhouse clipboard styling
app.js              # Inventory data, localStorage, copy, CSV, search, and PWA registration
manifest.json       # PWA install metadata
service-worker.js   # Offline cache for GitHub Pages hosting
icon.svg            # PWA/home-screen icon
README.md           # Setup and usage instructions
```

## Notes for Kitchen Use

- Progress is stored in the browser on the current device. Clearing browser site data will clear saved counts.
- Use **Clear All Counts** after confirming an order or when starting a fresh inventory cycle. This clears the daily on-hand counts, order quantities, and ordering checks while keeping saved pars and vendor notes/pack-size details.
- The text document includes only rows with the `Needs Ordering` checkbox selected, formatted as the item name followed by `Order: quantity`.

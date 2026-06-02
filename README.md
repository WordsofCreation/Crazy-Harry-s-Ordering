# Crazy Harry’s Ingredient Par & Order List

A mobile-first Progressive Web App (PWA) for Crazy Harry’s Steakhouse. Chefs can fill out ingredient inventory counts, mark items that need ordering, copy a clean vendor order list, and export the full par sheet as CSV.

## Features

- Phone-friendly layout with large touch targets.
- Collapsible sections for bakery, protein, dairy, produce, pantry, condiments, dessert, supplies, and notes.
- Editable `On Hand`, `Order Qty`, and `Vendor Notes` fields for every ingredient.
- `Needs Ordering` checkbox for quick item selection.
- Search/filter box for ingredients or section names.
- `Copy Order List` creates a clean text list containing only items with an order quantity or `Needs Ordering` checked.
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

## GitHub Pages Setup

1. Push these files to a GitHub repository.
2. In GitHub, go to **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Select the branch that contains the app, usually `main`, and choose the repository root `/` as the folder.
5. Click **Save**.
6. After GitHub Pages finishes deploying, open the provided Pages URL on a phone.
7. Use the browser share/menu option and choose **Add to Home Screen** to install the PWA.

## File Structure

```text
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
- Use **Clear All Counts** after confirming an order or when starting a fresh inventory cycle.
- The copied order list only includes items with an `Order Qty` entered or `Needs Ordering` checked.

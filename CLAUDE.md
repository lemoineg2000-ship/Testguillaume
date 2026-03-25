# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Revio** is a fully client-side (no build step, no server) browser application that generates printable LLD (Long-term Leasing) vehicle catalogues from an Ayvens CSV export. Everything runs in the browser via native ES modules.

Open `revio/index.html` directly in a browser (or serve it with any static file server) — no npm install, no compile step.

## Architecture

The app has three screens managed by toggling `display` styles:
1. **Upload screen** — collects client name, catalogue name, and a CSV file
2. **Loading screen** — shown during PapaParse processing
3. **Catalogue screen** — toolbar + rendered pages

### JS module responsibilities (`revio/js/`)

| File | Role |
|------|------|
| `main.js` | Entry point. Wires DOM event listeners (drag-drop, file input, toolbar buttons). |
| `state.js` | Single shared mutable object (`state`) holding `currentRows`, `clientName`, `catalogueName`, `currentFilename`, `pageCount`. |
| `csv.js` | Calls PapaParse on the uploaded file, populates `state.currentRows`, then calls `generateCatalogue()`. |
| `render.js` | Builds the DOM: cover page (`buildCoverPage`), one page per vehicle (`buildPage`), summary table (`buildSummaryPage` — only if ≥ 2 vehicles). Also exports `resetToUpload`. |
| `helpers.js` | Pure formatting utilities: `fmtNum`, `fmtEur`, `fmtDate`, `esc` (HTML-escape), `capitalize`, `isElec`, `energyBadge`. |
| `icons.js` | SVG icon constants (`ICON_BUILD`, `ICON_TIRE`, `ICON_SAFETY`, `ICON_GEAR`) and `iconImg` helper. |
| `photo.js` | Per-vehicle image handling: drag-drop, file picker, URL paste, remove button (`attachPhotoHandlers`, `fitOptions`). |
| `export.js` | `downloadHTML()` — serialises the current DOM + inlined CSS into a standalone `.html` file for download. |

### CSS (`revio/css/`)

- `variables.css` — CSS custom properties / design tokens
- `upload.css`, `catalogue.css`, `cover.css`, `summary.css` — screen-specific styles
- `print.css` — `@media print` rules for A4 landscape output (297×210 mm)

## Key CSV Column Names

The app reads these French-language column headers directly from the Ayvens export:

`Marque`, `Génération`, `Modèle (label)`, `Énergie`, `Transmission`, `Portes`, `Type véhicule`, `N° demande`, `Date/heure`, `Durée (mois)`, `Kilométrage (km)`, `Loyer mensuel (€)`, `TCO mensuel (€)` / `TCO / mois (€)`, `Prix catalogue (€)`, `Total options (€)`, `Détail options` (pipe-separated), `Maintenance`, `Pneus (type)`, `Pneus (quantité)`, `Assurance (offre)`, `Véh. remplacement`, `Coût carburant (€)`, `TVS mensuelle (€)`, `AND mensuelle (€)`, `Charges patronales AEN (€)`, `Malus CO2 (€)`, `Malus au poids (€)`, `Autonomie batterie`, `Consommation`, `CO2 (g/km)`, `Volume coffre (L)`, `Eco score`.

## Running Locally

```bash
# Any static server works, e.g.:
npx serve revio
# or
python3 -m http.server 8080 --directory revio
```

Then open `http://localhost:8080`.

The standalone file `revio_generator_52 copie.html` at the repo root is a self-contained snapshot of an earlier version.

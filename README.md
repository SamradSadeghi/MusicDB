# MusicDB

This is a static website for browsing music artists using a JSON database.

## Project structure
- `index.html` - Home page with search interface
- `artist.html` - Artist detail page with discography tabs
- `styles.css` - Shared site styling
- `final_database.json` - Artist data used by both pages
- `placeholder.png` - Optional image asset

## GitHub Pages setup
To deploy this site on GitHub Pages:
1. Push this repository to GitHub.
2. Open the repository Settings > Pages.
3. Set the source branch to `main` (or your default branch).
4. Set the folder to `/` (root).
5. Save and wait for deployment.

The site is served from the repository root, so all files should stay at the top level.

## Local testing
Run a simple static server from the project root:

- Python 3: `python -m http.server 8000`
- Open `http://localhost:8000`

## Notes
- The site does not use an external `app.js` file; the JavaScript is embedded directly in `index.html` and `artist.html`.
- `final_database.json` must remain in the project root so both pages can load it correctly.
- If you want to use a `docs/` folder instead, move the HTML/CSS/JSON files into `docs/` and point GitHub Pages to that folder.

## Features
- Search for artists by name (live results)
- Artist pages with stats and discography
- Tabs for Discography, Singles, Albums
- Modern UI with responsive design
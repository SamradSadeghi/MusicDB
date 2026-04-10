# MusicDB - GitHub Pages Setup

This is a static website for displaying music artist data from a JSON database.

## Files Structure
- `index.html` - Home page with search
- `artist.html` - Artist detail page
- `styles.css` - Styling with Lexend font and custom color palette
- `app.js` - JavaScript for search and artist display (It could be handled in the HTML files as well)
- `final_database.json` - The artist database

## GitHub Pages Setup
1. Push the `docs/` folder to your repository
2. Go to repository Settings > Pages
3. Set Source to "Deploy from a branch"
4. Choose branch `main` 
5. Save and wait for deployment

## Local Testing
To test locally, you can use a simple HTTP server:
- Python: `python -m http.server 8000` 
- Then open `http://localhost:8000` in your browser

## Features
- Search for artists by name (live results)
- Artist pages with stats and discography
- Tabs for Discography, Singles, Albums
- Modern UI with responsive design
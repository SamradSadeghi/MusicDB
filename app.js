// Global variables
let artistsData = [];
let currentArtist = null;

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    fetch('data/final_database.json')
        .then(response => response.json())
        .then(data => {
            artistsData = data;
            initPage();
        })
        .catch(error => console.error('Error loading data:', error));
});

function initPage() {
    const path = window.location.pathname;
    if (path.includes('artist.html')) {
        initArtistPage();
    } else {
        initHomePage();
    }
}

function initHomePage() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (query.length === 0) {
            searchResults.innerHTML = '';
            return;
        }

        const matches = artistsData.filter(artist =>
            artist.name.toLowerCase().includes(query)
        ).slice(0, 10); // Limit to 10 results

        searchResults.innerHTML = matches.map(artist => `
            <div class="search-result" data-token="${artist.token}">
                ${artist.name}
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', function() {
                const token = this.dataset.token;
                window.location.href = `artist.html?token=${token}`;
            });
        });
    });
}

function initArtistPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    currentArtist = artistsData.find(artist => artist.token === token);
    if (!currentArtist) {
        window.location.href = 'index.html';
        return;
    }

    displayArtistInfo();
    displayContent('discography');

    // Back button
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            displayContent(this.dataset.tab);
        });
    });
}

function displayArtistInfo() {
    document.getElementById('artist-name').textContent = currentArtist.name;
    document.getElementById('subscribers').textContent = formatNumber(currentArtist.subscribers);
    document.getElementById('listeners').textContent = formatNumber(currentArtist.listeners);
    document.getElementById('album-count').textContent = currentArtist.album_count;
    document.getElementById('track-count').textContent = currentArtist.track_count;
    document.getElementById('total-minutes').textContent = Math.round(currentArtist.total_length_minutes);
}

function displayContent(tab) {
    const contentArea = document.getElementById('content-area');
    let content = '';

    const sortedAlbums = [...currentArtist.albums].sort((a, b) => (b.year || 0) - (a.year || 0));

    if (tab === 'discography') {
        content = sortedAlbums.map(album => createAlbumHTML(album)).join('');
    } else if (tab === 'singles') {
        const singles = sortedAlbums.filter(album => album.type === 1); // Assuming type 1 is single
        content = singles.map(album => createAlbumHTML(album)).join('');
    } else if (tab === 'albums') {
        const albums = sortedAlbums.filter(album => album.type === 0); // Assuming type 0 is album
        content = albums.map(album => createAlbumHTML(album)).join('');
    }

    contentArea.innerHTML = content;
}

function createAlbumHTML(album) {
    const tracksHTML = album.tracks.map(track => `
        <li class="track-item">
            <span class="track-title">${track.title}</span>
            <span class="track-plays">${formatNumber(track.plays)} plays</span>
            <span class="track-length">${formatDuration(track.length)}</span>
        </li>
    `).join('');

    return `
        <div class="album-item">
            <div class="album-title">${album.title}</div>
            <div class="album-stats">
                <span>Year: ${album.year || 'N/A'}</span>
                <span>Songs: ${album.songs || album.tracks.length}</span>
                <span>Length: ${formatDuration(album.length)}</span>
            </div>
            <ul class="track-list">
                ${tracksHTML}
            </ul>
        </div>
    `;
}

function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString();
}

function formatDuration(seconds) {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
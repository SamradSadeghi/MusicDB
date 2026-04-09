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
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    const renderResults = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query.length === 0) {
            searchResults.innerHTML = '<div class="search-message">Start typing to find an artist</div>';
            return [];
        }

        const matches = artistsData.filter(artist =>
            artist.name.toLowerCase().includes(query)
        ).slice(0, 8);

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="search-message">No artists found.</div>';
            return [];
        }

        searchResults.innerHTML = matches.map(artist => `
            <button type="button" class="search-result" data-token="${artist.token}">
                <span>${artist.name}</span>
                <span class="result-meta">${formatNumber(artist.listeners)} listeners</span>
            </button>
        `).join('');

        document.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', function() {
                navigateToArtist(this.dataset.token);
            });
        });

        return matches;
    };

    searchInput.addEventListener('input', renderResults);

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const matches = renderResults();
        if (matches.length === 1) {
            navigateToArtist(matches[0].token);
        } else if (matches.length > 1) {
            const firstMatch = matches[0];
            navigateToArtist(firstMatch.token);
        }
    });

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const matches = renderResults();
            if (matches.length > 0) {
                navigateToArtist(matches[0].token);
            }
        }
    });

    searchResults.innerHTML = '<div class="search-message">Start typing to find an artist</div>';
}

function navigateToArtist(token) {
    window.location.href = `artist.html?token=${encodeURIComponent(token)}`;
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

    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

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
    const aboutElement = document.getElementById('artist-about');
    if (aboutElement) {
        aboutElement.textContent = currentArtist.about || 'No artist description available.';
    }
}

function displayContent(tab) {
    const contentArea = document.getElementById('content-area');
    let content = '';

    const sortedAlbums = [...currentArtist.albums].sort((a, b) => {
        const aValue = a.year || 0;
        const bValue = b.year || 0;
        return bValue - aValue;
    });

    if (tab === 'discography') {
        content = sortedAlbums.map(album => createAlbumHTML(album)).join('');
    } else if (tab === 'singles') {
        const singles = sortedAlbums.filter(album => album.type === 1);
        content = singles.length > 0 ? singles.map(album => createAlbumHTML(album)).join('') : '<div class="empty-state">No singles found for this artist.</div>';
    } else if (tab === 'albums') {
        const albums = sortedAlbums.filter(album => album.type === 0);
        content = albums.length > 0 ? albums.map(album => createAlbumHTML(album)).join('') : '<div class="empty-state">No albums found for this artist.</div>';
    }

    contentArea.innerHTML = content;
}

function createAlbumHTML(album) {
    const tracksHTML = album.tracks.map(track => `
        <li class="track-item">
            <span class="track-title">${track.title}</span>
            <span class="track-meta">
                ${formatDuration(track.length)} · ${formatNumber(track.plays)} plays
            </span>
        </li>
    `).join('');

    return `
        <article class="album-item">
            <div class="album-header">
                <div>
                    <h2 class="album-title">${album.title}</h2>
                    <p class="album-type">${album.type === 1 ? 'Single' : 'Album'}</p>
                </div>
                <div class="album-badge">${album.year || 'N/A'}</div>
            </div>
            <div class="album-stats">
                <span>${album.songs || album.tracks.length} songs</span>
                <span>${formatDuration(album.length)}</span>
            </div>
            <ul class="track-list">
                ${tracksHTML}
            </ul>
        </article>
    `;
}

function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString();
}

function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
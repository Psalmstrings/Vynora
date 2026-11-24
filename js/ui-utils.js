/**
 * PsalmStrings UI Utilities
 * Reusable card renderers, toast alerts, modals, skeletons, and carousel scrolling.
 */

import { tmdbApi } from './tmdb-api.js';
import { libraryService } from './library.js';
import { authService } from './auth.js';
import { GENRE_MAP, setTmdbApiKey, getTmdbApiKey } from './config.js';

/**
 * Modern floating Toast Notification
 */
export function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('psalm-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'psalm-toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  
  let iconClass = 'fa-check-circle';
  if (type === 'error') iconClass = 'fa-exclamation-circle';
  if (type === 'warning') iconClass = 'fa-exclamation-triangle';
  if (type === 'info') iconClass = 'fa-info-circle';

  toast.innerHTML = `
    <i class="fas ${iconClass} toast-icon"></i>
    <span class="toast-msg">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger entrance
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/**
 * Generates an interactive Movie Card DOM Element
 */
export function createMovieCard(movie, options = {}) {
  const card = document.createElement('div');
  card.className = 'psalm-movie-card';
  card.setAttribute('data-id', movie.id);

  const posterSrc = tmdbApi.getImageUrl(movie.poster_path, 'w500');
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'NR';
  const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
  const firstGenreId = movie.genre_ids && movie.genre_ids.length ? movie.genre_ids[0] : null;
  const genreName = firstGenreId ? (GENRE_MAP[firstGenreId] || '') : '';

  const isFav = libraryService.isFavourite(movie.id);
  const isWatch = libraryService.isWatchlisted(movie.id);

  // Determine path to movie details depending on current URL depth
  const isPagesDir = window.location.pathname.includes('/pages/');
  const detailsHref = isPagesDir 
    ? `./movie-details.html?id=${movie.id}` 
    : `./pages/movie-details.html?id=${movie.id}`;

  const reasonBadge = movie.recommendationReason ? `
    <div class="card-reason-badge" title="${movie.recommendationReason}">
      <i class="fas fa-sparkles"></i> ${movie.recommendationReason}
    </div>
  ` : '';

  card.innerHTML = `
    <div class="card-poster-wrapper">
      <img 
        src="${posterSrc}" 
        alt="${movie.title || 'Movie Poster'}" 
        class="card-poster-img"
        loading="lazy"
        onerror="this.src='https://placehold.co/300x450/1a1a1a/fcd218?text=No+Poster'"
      />
      <div class="card-overlay">
        <div class="card-actions-top">
          <button 
            type="button" 
            class="card-btn-action btn-fav ${isFav ? 'active' : ''}" 
            data-fav-movie-id="${movie.id}" 
            title="${isFav ? 'Remove Favourite' : 'Add to Favourites'}"
          >
            <i class="${isFav ? 'fas fa-heart text-danger' : 'far fa-heart'}"></i>
          </button>
          <button 
            type="button" 
            class="card-btn-action btn-watch ${isWatch ? 'active' : ''}" 
            data-watch-movie-id="${movie.id}" 
            title="${isWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}"
          >
            <i class="${isWatch ? 'fas fa-bookmark text-gold' : 'far fa-bookmark'}"></i>
          </button>
        </div>
        
        <div class="card-overlay-bottom">
          <div class="card-rating">
            <i class="fas fa-star rating-star"></i>
            <span>${rating}</span>
          </div>
          <a href="${detailsHref}" class="card-btn-play" title="View Details">
            <i class="fas fa-play"></i> Details
          </a>
        </div>
      </div>
    </div>
    ${reasonBadge}
    <div class="card-meta">
      <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
      <div class="card-subtitle">
        <span class="card-year">${year}</span>
        ${genreName ? `<span class="card-genre">${genreName}</span>` : ''}
      </div>
    </div>
  `;

  // Attach Card Click to Details
  card.addEventListener('click', (e) => {
    // If click was on action button, prevent navigating
    if (e.target.closest('.card-btn-action')) return;
    window.location.href = detailsHref;
  });

  // Action Button Listeners
  const favBtn = card.querySelector('.btn-fav');
  favBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!authService.currentUser) {
      showToast('Please sign in to save favourites.', 'info');
      return;
    }
    try {
      const added = await libraryService.toggleFavourite(movie);
      showToast(added ? `Added "${movie.title}" to Favourites` : `Removed from Favourites`, 'success');
      libraryService.syncCardButtons();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  const watchBtn = card.querySelector('.btn-watch');
  watchBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!authService.currentUser) {
      showToast('Please sign in to save to your watchlist.', 'info');
      return;
    }
    try {
      const added = await libraryService.toggleWatchlist(movie);
      showToast(added ? `Added "${movie.title}" to Watchlist` : `Removed from Watchlist`, 'success');
      libraryService.syncCardButtons();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  return card;
}

/**
 * Renders skeleton placeholder cards while loading
 */
export function renderSkeletons(container, count = 6) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'psalm-movie-card skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-poster shimmer"></div>
      <div class="skeleton-title shimmer"></div>
      <div class="skeleton-sub shimmer"></div>
    `;
    container.appendChild(skeleton);
  }
}

/**
 * Configures smooth horizontal scrolling for row carousels
 */
export function setupRowCarousel(rowContainer, leftBtn, rightBtn) {
  if (!rowContainer) return;

  const scrollDistance = () => rowContainer.clientWidth * 0.75;

  if (leftBtn) {
    leftBtn.addEventListener('click', () => {
      rowContainer.scrollBy({ left: -scrollDistance(), behavior: 'smooth' });
    });
  }

  if (rightBtn) {
    rightBtn.addEventListener('click', () => {
      rowContainer.scrollBy({ left: scrollDistance(), behavior: 'smooth' });
    });
  }
}

/**
 * Universal Search Autocomplete Box
 */
export function initSearchAutocomplete(searchInput, resultsContainer) {
  if (!searchInput || !resultsContainer) return;

  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length < 2) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(async () => {
      resultsContainer.style.display = 'block';
      resultsContainer.innerHTML = `
        <div class="search-popup-status">
          <i class="fas fa-spinner fa-spin"></i> Searching for "${query}"...
        </div>
      `;

      try {
        const res = await tmdbApi.searchMovies(query);
        const movies = (res.results || []).slice(0, 6);

        if (movies.length === 0) {
          resultsContainer.innerHTML = `
            <div class="search-popup-status">No movies found matching "${query}"</div>
          `;
          return;
        }

        const isPagesDir = window.location.pathname.includes('/pages/');
        const detailsPrefix = isPagesDir ? './movie-details.html?id=' : './pages/movie-details.html?id=';

        resultsContainer.innerHTML = movies.map(m => {
          const poster = tmdbApi.getImageUrl(m.poster_path, 'w92');
          const year = m.release_date ? m.release_date.substring(0, 4) : '';
          const score = m.vote_average ? m.vote_average.toFixed(1) : 'NR';
          return `
            <a href="${detailsPrefix}${m.id}" class="search-popup-item">
              <img src="${poster}" alt="${m.title}" onerror="this.src='https://placehold.co/60x90/222/fcd218?text=Film'">
              <div class="search-popup-info">
                <strong>${m.title}</strong>
                <div class="search-popup-meta">
                  <span>${year}</span>
                  <span class="search-rating"><i class="fas fa-star text-gold"></i> ${score}</span>
                </div>
              </div>
            </a>
          `;
        }).join('');
      } catch (err) {
        resultsContainer.innerHTML = `<div class="search-popup-status">Search unavailable. Try again.</div>`;
      }
    }, 300);
  });

  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.style.display = 'none';
    }
  });
}

/**
 * In-App TMDB API Key Settings Modal
 */
export function openTmdbModal() {
  let modal = document.getElementById('tmdb-config-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'tmdb-config-modal';
    modal.className = 'psalm-modal-backdrop';
    modal.innerHTML = `
      <div class="psalm-modal-card">
        <div class="modal-header">
          <h3><i class="fas fa-key text-gold"></i> TMDB API Configuration</h3>
          <button class="modal-close-btn" id="close-tmdb-modal-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">
            Connect your free <strong>The Movie Database (TMDB)</strong> API Key to unlock live trending blockbusters, cast bios, and video trailers!
          </p>
          <div class="modal-form-group">
            <label for="input-tmdb-key">TMDB API Key (v3 auth):</label>
            <input 
              type="text" 
              id="input-tmdb-key" 
              placeholder="e.g. 8414ff428055f7883c3326ffdd34b2d6"
              value="${getTmdbApiKey()}"
            />
          </div>
          <div id="tmdb-test-result" class="modal-test-status"></div>
          
          <div class="api-help-box">
            <strong>How to get a free API Key:</strong>
            <ol>
              <li>Create a free account at <a href="https://www.themoviedb.org/signup" target="_blank" rel="noopener">themoviedb.org</a></li>
              <li>Go to <em>Settings &gt; API</em> and request an API Key (Developer / Personal)</li>
              <li>Paste the API Key above and click <em>Save & Test</em></li>
            </ol>
            <small class="text-muted">
              Note: If left blank, PsalmStrings uses its curated offline dataset so you can explore all features right away!
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-modal-clear" id="btn-clear-tmdb-key">Clear Key</button>
          <button type="button" class="btn-modal-save" id="btn-save-tmdb-key">Save & Test</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#close-tmdb-modal-btn').addEventListener('click', () => {
      modal.classList.remove('open');
    });

    modal.querySelector('#btn-clear-tmdb-key').addEventListener('click', () => {
      setTmdbApiKey('');
      modal.querySelector('#input-tmdb-key').value = '';
      showToast('TMDB API Key cleared. Using curated dataset.', 'info');
      modal.classList.remove('open');
      setTimeout(() => window.location.reload(), 400);
    });

    modal.querySelector('#btn-save-tmdb-key').addEventListener('click', async () => {
      const val = modal.querySelector('#input-tmdb-key').value.trim();
      const statusBox = modal.querySelector('#tmdb-test-result');
      
      if (!val) {
        setTmdbApiKey('');
        showToast('Empty key. Reverted to curated catalog.', 'info');
        modal.classList.remove('open');
        return;
      }

      statusBox.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying key with TMDB...';
      try {
        const testRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${val}&page=1`);
        if (testRes.ok) {
          setTmdbApiKey(val);
          sessionStorage.clear(); // Clear cached fallback data
          statusBox.innerHTML = '<span class="text-success"><i class="fas fa-check-circle"></i> Key verified successfully!</span>';
          showToast('Live TMDB API connected!', 'success');
          setTimeout(() => {
            modal.classList.remove('open');
            window.location.reload();
          }, 700);
        } else {
          statusBox.innerHTML = `<span class="text-danger"><i class="fas fa-times-circle"></i> Invalid key (HTTP ${testRes.status}). Check and retry.</span>`;
        }
      } catch (err) {
        statusBox.innerHTML = `<span class="text-danger"><i class="fas fa-times-circle"></i> Connection error: ${err.message}</span>`;
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  modal.classList.add('open');
}

// Expose globally for header menus
window.openTmdbModal = openTmdbModal;

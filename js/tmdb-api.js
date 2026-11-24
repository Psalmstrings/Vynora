/**
 * TMDB Movie API Client
 * Features request caching, error handling, image fallback resolution, and offline resilience.
 */

import { TMDB_CONFIG, getTmdbApiKey, GENRE_MAP } from './config.js';
import { FALLBACK_MOVIES } from './fallback-data.js';

class TmdbApiClient {
  constructor() {
    this.cachePrefix = 'psalmstrings_tmdb_cache_';
    this.cacheTtlMs = TMDB_CONFIG.CACHE_TTL_MS;
  }

  /**
   * Checks whether a live TMDB key is available.
   */
  hasApiKey() {
    const key = getTmdbApiKey();
    return Boolean(key && key.length > 5);
  }

  /**
   * Helper to build a cached response or fetch fresh data
   */
  async _fetchWithCache(cacheKey, url) {
    // 1. Try reading from sessionStorage
    try {
      const cached = sessionStorage.getItem(this.cachePrefix + cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < this.cacheTtlMs) {
          return parsed.data;
        }
      }
    } catch (e) {
      console.warn("SessionStorage read error:", e);
    }

    // 2. Perform live network fetch
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB HTTP Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();

    // 3. Save to sessionStorage
    try {
      sessionStorage.setItem(
        this.cachePrefix + cacheKey,
        JSON.stringify({ timestamp: Date.now(), data })
      );
    } catch (e) {
      console.warn("SessionStorage write error (cache may be full):", e);
    }

    return data;
  }

  /**
   * Constructs the full TMDB URL including credentials
   */
  _buildUrl(endpoint, params = {}) {
    const key = getTmdbApiKey();
    const query = new URLSearchParams({
      api_key: key,
      language: 'en-US',
      ...params
    });
    return `${TMDB_CONFIG.BASE_URL}${endpoint}?${query.toString()}`;
  }

  /**
   * Fetch Trending Movies (day or week)
   */
  async getTrending(timeWindow = 'week') {
    if (!this.hasApiKey()) {
      return { results: FALLBACK_MOVIES.slice(0, 10), isFallback: true };
    }
    try {
      const url = this._buildUrl(`/trending/movie/${timeWindow}`);
      const data = await this._fetchWithCache(`trending_${timeWindow}`, url);
      return { ...data, isFallback: false };
    } catch (error) {
      console.warn("Falling back for trending movies:", error);
      return { results: FALLBACK_MOVIES.slice(0, 10), isFallback: true };
    }
  }

  /**
   * Fetch Popular Movies
   */
  async getPopular(page = 1) {
    if (!this.hasApiKey()) {
      return { results: FALLBACK_MOVIES.slice(0, 12), isFallback: true };
    }
    try {
      const url = this._buildUrl('/movie/popular', { page });
      const data = await this._fetchWithCache(`popular_${page}`, url);
      return { ...data, isFallback: false };
    } catch (error) {
      console.warn("Falling back for popular movies:", error);
      return { results: FALLBACK_MOVIES.slice(0, 12), isFallback: true };
    }
  }

  /**
   * Fetch Top Rated Movies
   */
  async getTopRated(page = 1) {
    if (!this.hasApiKey()) {
      const sorted = [...FALLBACK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
      return { results: sorted.slice(0, 12), isFallback: true };
    }
    try {
      const url = this._buildUrl('/movie/top_rated', { page });
      const data = await this._fetchWithCache(`top_rated_${page}`, url);
      return { ...data, isFallback: false };
    } catch (error) {
      console.warn("Falling back for top rated movies:", error);
      const sorted = [...FALLBACK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
      return { results: sorted.slice(0, 12), isFallback: true };
    }
  }

  /**
   * Fetch Upcoming Releases
   */
  async getUpcoming(page = 1) {
    if (!this.hasApiKey()) {
      return { results: FALLBACK_MOVIES.slice(5, 15), isFallback: true };
    }
    try {
      const url = this._buildUrl('/movie/upcoming', { page });
      const data = await this._fetchWithCache(`upcoming_${page}`, url);
      return { ...data, isFallback: false };
    } catch (error) {
      console.warn("Falling back for upcoming releases:", error);
      return { results: FALLBACK_MOVIES.slice(5, 15), isFallback: true };
    }
  }

  /**
   * Fetch Movies by Genre ID
   */
  async getByGenre(genreId, page = 1) {
    if (!this.hasApiKey()) {
      const filtered = FALLBACK_MOVIES.filter(m => m.genre_ids && m.genre_ids.includes(Number(genreId)));
      return { results: filtered.length ? filtered : FALLBACK_MOVIES.slice(0, 8), isFallback: true };
    }
    try {
      const url = this._buildUrl('/discover/movie', {
        with_genres: genreId,
        sort_by: 'popularity.desc',
        page
      });
      const data = await this._fetchWithCache(`genre_${genreId}_${page}`, url);
      return { ...data, isFallback: false };
    } catch (error) {
      console.warn(`Falling back for genre ${genreId}:`, error);
      const filtered = FALLBACK_MOVIES.filter(m => m.genre_ids && m.genre_ids.includes(Number(genreId)));
      return { results: filtered.length ? filtered : FALLBACK_MOVIES.slice(0, 8), isFallback: true };
    }
  }

  /**
   * Fetch Movie Details by ID, including credits, videos, and recommendations
   */
  async getMovieDetails(movieId) {
    const numId = Number(movieId);

    if (!this.hasApiKey()) {
      const found = FALLBACK_MOVIES.find(m => m.id === numId) || FALLBACK_MOVIES[0];
      return this._formatFallbackDetails(found);
    }

    try {
      const url = this._buildUrl(`/movie/${movieId}`, {
        append_to_response: 'credits,videos,similar,recommendations'
      });
      const data = await this._fetchWithCache(`movie_${movieId}`, url);
      return {
        ...data,
        isFallback: false,
        director: this._extractDirector(data.credits),
        trailer_key: this._extractTrailerKey(data.videos)
      };
    } catch (error) {
      console.warn(`Falling back for movie details ${movieId}:`, error);
      const found = FALLBACK_MOVIES.find(m => m.id === numId) || FALLBACK_MOVIES[0];
      return this._formatFallbackDetails(found);
    }
  }

  /**
   * Search Movies by Query text
   */
  async searchMovies(query, page = 1) {
    const cleanQuery = query ? query.trim() : '';
    if (!cleanQuery) return { results: [], total_results: 0 };

    if (!this.hasApiKey()) {
      const term = cleanQuery.toLowerCase();
      const results = FALLBACK_MOVIES.filter(m => 
        m.title.toLowerCase().includes(term) || 
        (m.overview && m.overview.toLowerCase().includes(term))
      );
      return { results, total_results: results.length, isFallback: true };
    }

    try {
      const url = this._buildUrl('/search/movie', { query: cleanQuery, page });
      const data = await this._fetchWithCache(`search_${cleanQuery}_${page}`, url);
      return { ...data, isFallback: false };
    } catch (error) {
      console.warn("Falling back for search query:", error);
      const term = cleanQuery.toLowerCase();
      const results = FALLBACK_MOVIES.filter(m => 
        m.title.toLowerCase().includes(term) || 
        (m.overview && m.overview.toLowerCase().includes(term))
      );
      return { results, total_results: results.length, isFallback: true };
    }
  }

  /**
   * Image URL Formatter
   */
  getImageUrl(path, size = 'w500') {
    if (!path) return TMDB_CONFIG.POSTER_PLACEHOLDER;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('./') || path.startsWith('../')) return path;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  /**
   * Backdrop URL Formatter
   */
  getBackdropUrl(path, size = 'original') {
    if (!path) return TMDB_CONFIG.BACKDROP_PLACEHOLDER;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('./') || path.startsWith('../')) return path;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  // Helpers
  _extractDirector(credits) {
    if (!credits || !credits.crew) return 'Unknown';
    const director = credits.crew.find(c => c.job === 'Director');
    return director ? director.name : 'Unknown';
  }

  _extractTrailerKey(videos) {
    if (!videos || !videos.results || !videos.results.length) return null;
    const officialTrailer = videos.results.find(v => 
      v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );
    return officialTrailer ? officialTrailer.key : videos.results[0].key;
  }

  _formatFallbackDetails(movie) {
    return {
      ...movie,
      isFallback: true,
      genres: (movie.genre_ids || []).map(id => ({ id, name: GENRE_MAP[id] || 'Cinema' })),
      credits: {
        cast: movie.cast || [],
        crew: [{ job: 'Director', name: movie.director || 'Director' }]
      },
      similar: {
        results: FALLBACK_MOVIES.filter(m => m.id !== movie.id).slice(0, 6)
      },
      recommendations: {
        results: FALLBACK_MOVIES.filter(m => m.id !== movie.id).slice(6, 12)
      }
    };
  }
}

export const tmdbApi = new TmdbApiClient();

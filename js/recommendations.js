/**
 * PsalmStrings Explainable Movie Recommendation Engine
 * Provides honest, transparent, activity-based recommendations.
 */

import { tmdbApi } from './tmdb-api.js';
import { GENRE_MAP } from './config.js';
import { FALLBACK_MOVIES } from './fallback-data.js';

class RecommendationEngine {
  /**
   * Generates recommendations based on user context.
   * @param {Object} userContext
   * @param {Array<string>} userContext.preferredGenres - Genre names from profile (e.g. ['Action', 'Sci-Fi'])
   * @param {Array<Object>} userContext.favourites - List of movie objects saved by user
   * @param {Array<Object>} userContext.watchlist - List of movie objects in user's watchlist
   * @param {Array<Object>} userContext.ratings - List of { movieId, rating, title, genre_ids }
   */
  async getRecommendations(userContext = {}) {
    const { preferredGenres = [], favourites = [], watchlist = [], ratings = [] } = userContext;

    // Check if user has sufficient activity to personalize
    const hasActivity = preferredGenres.length > 0 || favourites.length > 0 || ratings.length > 0;

    if (!hasActivity) {
      return this._getGeneralRecommendations();
    }

    // 1. Calculate Genre Affinity Scores
    const genreScores = {};
    const genreNameToId = Object.entries(GENRE_MAP).reduce((acc, [id, name]) => {
      acc[name.toLowerCase()] = Number(id);
      return acc;
    }, {});

    // Profile preferences (+3 weight)
    preferredGenres.forEach(genreName => {
      const id = genreNameToId[genreName.toLowerCase()];
      if (id) {
        genreScores[id] = (genreScores[id] || 0) + 3;
      }
    });

    // Favourites (+2 weight per genre)
    favourites.forEach(movie => {
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        movie.genre_ids.forEach(id => {
          genreScores[id] = (genreScores[id] || 0) + 2;
        });
      }
    });

    // Highly rated movies (rating >= 7: +3 weight)
    ratings.forEach(r => {
      if (r.rating >= 7 && r.genre_ids) {
        r.genre_ids.forEach(id => {
          genreScores[id] = (genreScores[id] || 0) + (r.rating >= 9 ? 4 : 2);
        });
      }
    });

    // Sort genres by affinity score
    const sortedGenreIds = Object.keys(genreScores)
      .map(Number)
      .sort((a, b) => genreScores[b] - genreScores[a]);

    const primaryGenreId = sortedGenreIds[0] || 28; // Default to Action if none
    const secondaryGenreId = sortedGenreIds[1] || null;

    // Excluded movie IDs (already saved/watched)
    const savedIds = new Set([
      ...favourites.map(f => Number(f.movieId || f.id)),
      ...watchlist.map(w => Number(w.movieId || w.id))
    ]);

    // 2. Fetch candidate movies matching the user's top genres
    let candidates = [];
    try {
      const primaryResult = await tmdbApi.getByGenre(primaryGenreId);
      candidates = [...(primaryResult.results || [])];

      if (secondaryGenreId) {
        const secondaryResult = await tmdbApi.getByGenre(secondaryGenreId);
        candidates = [...candidates, ...(secondaryResult.results || [])];
      }
    } catch (e) {
      console.warn("Error fetching genre candidates for recommendations:", e);
      candidates = [...FALLBACK_MOVIES];
    }

    // Filter out duplicates and already saved movies
    const uniqueCandidates = [];
    const seen = new Set();

    candidates.forEach(movie => {
      const id = Number(movie.id);
      if (!savedIds.has(id) && !seen.has(id)) {
        seen.add(id);
        uniqueCandidates.push(movie);
      }
    });

    // 3. Attach Explainable Reasons
    const primaryGenreName = GENRE_MAP[primaryGenreId] || 'Popular Genres';
    const favoriteAnchor = favourites.length > 0 ? favourites[0].title : null;

    const personalizedList = uniqueCandidates.slice(0, 10).map((movie, index) => {
      let reason = `Recommended because you enjoy ${primaryGenreName}`;
      if (favoriteAnchor && index % 2 === 1) {
        reason = `Similar to "${favoriteAnchor}" in your Favourites`;
      } else if (secondaryGenreId && movie.genre_ids && movie.genre_ids.includes(secondaryGenreId)) {
        reason = `Blends your interest in ${primaryGenreName} & ${GENRE_MAP[secondaryGenreId]}`;
      }

      return {
        ...movie,
        recommendationReason: reason
      };
    });

    // If candidate list was too small, pad with fallback
    if (personalizedList.length < 4) {
      return this._getGeneralRecommendations();
    }

    return {
      personalized: true,
      topGenre: primaryGenreName,
      results: personalizedList
    };
  }

  /**
   * General recommendations for visitors or new accounts with no history
   */
  async _getGeneralRecommendations() {
    try {
      const topRated = await tmdbApi.getTopRated(1);
      const results = (topRated.results || []).slice(0, 10).map(movie => ({
        ...movie,
        recommendationReason: "Acclaimed by audiences and critics worldwide"
      }));
      return {
        personalized: false,
        topGenre: "Global Hits",
        results
      };
    } catch (e) {
      const results = FALLBACK_MOVIES.slice(0, 8).map(movie => ({
        ...movie,
        recommendationReason: "Trending favorite in our community"
      }));
      return {
        personalized: false,
        topGenre: "Popular",
        results
      };
    }
  }
}

export const recommendationEngine = new RecommendationEngine();

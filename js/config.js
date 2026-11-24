/**
 * PsalmStrings Movie Discovery Platform - Global Configuration
 * Centralized settings for Firebase, TMDB API, and Local Storage keys.
 */

// TMDB API Configuration
export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  BACKDROP_BASE_URL: 'https://image.tmdb.org/t/p/original',
  POSTER_PLACEHOLDER: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23777%3Bfont-weight%3Abold%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A18pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23222%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2260%22%20y%3D%22230%22%3ENo%20Poster%20Available%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
  BACKDROP_PLACEHOLDER: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%221280%22%20height%3D%22720%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201280%20720%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%221280%22%20height%3D%22720%22%20fill%3D%22%23111%22%3E%3C%2Frect%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23555%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-size%3D%2232%22%20font-family%3Asans-serif%3EPsalmStrings%3C%2Ftext%3E%3C%2Fsvg%3E',
  STORAGE_KEY: 'psalmstrings_tmdb_api_key',
  CACHE_TTL_MS: 30 * 60 * 1000 // 30 minutes cache for TMDB API calls
};

/**
 * Retrieves the currently active TMDB API key.
 * Checks localStorage first, then window.ENV_TMDB_API_KEY, else returns empty string.
 */
export function getTmdbApiKey() {
  const storedKey = localStorage.getItem(TMDB_CONFIG.STORAGE_KEY);
  if (storedKey && storedKey.trim().length > 0) {
    return storedKey.trim();
  }
  if (typeof window !== 'undefined' && window.ENV_TMDB_API_KEY) {
    return window.ENV_TMDB_API_KEY.trim();
  }
  return '';
}

/**
 * Saves a TMDB API key into localStorage
 */
export function setTmdbApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(TMDB_CONFIG.STORAGE_KEY, key.trim());
    return true;
  } else {
    localStorage.removeItem(TMDB_CONFIG.STORAGE_KEY);
    return false;
  }
}

// Firebase Project Configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC5kROT39vzmZztR4k2BzYSL3PFlio1tUM",
  authDomain: "psalmstrings-7b9a9.firebaseapp.com",
  projectId: "psalmstrings-7b9a9",
  storageBucket: "psalmstrings-7b9a9.appspot.com",
  messagingSenderId: "765832868823",
  appId: "1:765832868823:web:0dd6e79ee4d3acde041192",
  measurementId: "G-LV8DV0TC8E"
};

// Official TMDB Genre ID to Name Mapping
export const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

// Available Avatar presets for users
export const AVATAR_PRESETS = [
  { id: 'avatar-1', name: 'Cyber Hero', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'avatar-2', name: 'Golden Scout', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 'avatar-3', name: 'Cinema Director', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { id: 'avatar-4', name: 'Sci-Fi Explorer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { id: 'avatar-5', name: 'Mystery Sleuth', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
  { id: 'avatar-6', name: 'Action Protagonist', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' }
];

export const DEFAULT_AVATAR = AVATAR_PRESETS[0].url;

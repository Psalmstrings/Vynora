/**
 * PsalmStrings User Library Service (Favourites, Watchlist & Ratings)
 * Synchronized with Cloud Firestore with subcollection isolation: users/{uid}/favourites/{movieId}
 */

import {
  db,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  serverTimestamp,
  onSnapshot
} from './firebase-init.js';
import { authService } from './auth.js';

class LibraryService {
  constructor() {
    this.favouritesMap = new Map();
    this.watchlistMap = new Map();
    this.ratingsMap = new Map();

    this._favUnsub = null;
    this._watchUnsub = null;
    this._ratingUnsub = null;

    // Listen to auth changes and initialize user library listeners
    authService.onAuth((user) => {
      this._cleanupListeners();
      if (user) {
        this._initUserLibrary(user.uid);
      } else {
        this.favouritesMap.clear();
        this.watchlistMap.clear();
        this.ratingsMap.clear();
        this._notifyLibraryChanged();
      }
    });

    this._changeListeners = [];
  }

  onLibraryChange(callback) {
    this._changeListeners.push(callback);
    callback({
      favourites: Array.from(this.favouritesMap.values()),
      watchlist: Array.from(this.watchlistMap.values()),
      ratings: Array.from(this.ratingsMap.values())
    });
    return () => {
      this._changeListeners = this._changeListeners.filter(cb => cb !== callback);
    };
  }

  _notifyLibraryChanged() {
    const payload = {
      favourites: Array.from(this.favouritesMap.values()),
      watchlist: Array.from(this.watchlistMap.values()),
      ratings: Array.from(this.ratingsMap.values())
    };
    this._changeListeners.forEach(cb => {
      try { cb(payload); } catch (e) { console.error("Library change callback error:", e); }
    });
  }

  _cleanupListeners() {
    if (this._favUnsub) { this._favUnsub(); this._favUnsub = null; }
    if (this._watchUnsub) { this._watchUnsub(); this._watchUnsub = null; }
    if (this._ratingUnsub) { this._ratingUnsub(); this._ratingUnsub = null; }
  }

  _initUserLibrary(uid) {
    // 1. Favourites Snapshot Listener
    const favCol = collection(db, "users", uid, "favourites");
    this._favUnsub = onSnapshot(favCol, (snapshot) => {
      this.favouritesMap.clear();
      snapshot.forEach(docSnap => {
        this.favouritesMap.set(String(docSnap.id), { id: docSnap.id, ...docSnap.data() });
      });
      this._notifyLibraryChanged();
      this.syncCardButtons();
    }, (err) => console.error("Error in favourites listener:", err));

    // 2. Watchlist Snapshot Listener
    const watchCol = collection(db, "users", uid, "watchlist");
    this._watchUnsub = onSnapshot(watchCol, (snapshot) => {
      this.watchlistMap.clear();
      snapshot.forEach(docSnap => {
        this.watchlistMap.set(String(docSnap.id), { id: docSnap.id, ...docSnap.data() });
      });
      this._notifyLibraryChanged();
      this.syncCardButtons();
    }, (err) => console.error("Error in watchlist listener:", err));

    // 3. Ratings Snapshot Listener
    const ratingCol = collection(db, "users", uid, "ratings");
    this._ratingUnsub = onSnapshot(ratingCol, (snapshot) => {
      this.ratingsMap.clear();
      snapshot.forEach(docSnap => {
        this.ratingsMap.set(String(docSnap.id), { movieId: docSnap.id, ...docSnap.data() });
      });
      this._notifyLibraryChanged();
    }, (err) => console.error("Error in ratings listener:", err));
  }

  // Query state checks
  isFavourite(movieId) {
    return this.favouritesMap.has(String(movieId));
  }

  isWatchlisted(movieId) {
    return this.watchlistMap.has(String(movieId));
  }

  getUserRating(movieId) {
    const r = this.ratingsMap.get(String(movieId));
    return r ? r.rating : 0;
  }

  getFavouritesList() {
    return Array.from(this.favouritesMap.values());
  }

  getWatchlistList() {
    return Array.from(this.watchlistMap.values());
  }

  getRatingsList() {
    return Array.from(this.ratingsMap.values());
  }

  // Mutations
  async toggleFavourite(movie) {
    const user = authService.currentUser;
    if (!user) throw new Error("Please sign in to save movies to Favourites.");

    const movieId = String(movie.id || movie.movieId);
    const favRef = doc(db, "users", user.uid, "favourites", movieId);

    if (this.isFavourite(movieId)) {
      await deleteDoc(favRef);
      return false; // Removed
    } else {
      const payload = {
        movieId: Number(movieId),
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        vote_average: Number(movie.vote_average || 0),
        release_date: movie.release_date || '',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
        addedAt: serverTimestamp()
      };
      await setDoc(favRef, payload);
      return true; // Added
    }
  }

  async toggleWatchlist(movie) {
    const user = authService.currentUser;
    if (!user) throw new Error("Please sign in to add movies to your Watchlist.");

    const movieId = String(movie.id || movie.movieId);
    const watchRef = doc(db, "users", user.uid, "watchlist", movieId);

    if (this.isWatchlisted(movieId)) {
      await deleteDoc(watchRef);
      return false; // Removed
    } else {
      const payload = {
        movieId: Number(movieId),
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        vote_average: Number(movie.vote_average || 0),
        release_date: movie.release_date || '',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
        addedAt: serverTimestamp()
      };
      await setDoc(watchRef, payload);
      return true; // Added
    }
  }

  async setRating(movie, rating) {
    const user = authService.currentUser;
    if (!user) throw new Error("Please sign in to rate movies.");

    const movieId = String(movie.id || movie.movieId);
    const ratingRef = doc(db, "users", user.uid, "ratings", movieId);

    const payload = {
      movieId: Number(movieId),
      rating: Number(rating),
      title: movie.title || movie.name || '',
      genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
      updatedAt: serverTimestamp()
    };

    await setDoc(ratingRef, payload);
    return true;
  }

  /**
   * Updates any active favourite or watchlist buttons currently rendered on screen
   */
  syncCardButtons() {
    document.querySelectorAll('[data-fav-movie-id]').forEach(btn => {
      const id = btn.getAttribute('data-fav-movie-id');
      const isFav = this.isFavourite(id);
      btn.classList.toggle('active', isFav);
      btn.innerHTML = isFav 
        ? '<i class="fas fa-heart text-danger"></i>' 
        : '<i class="far fa-heart"></i>';
      btn.setAttribute('title', isFav ? 'Remove from Favourites' : 'Add to Favourites');
    });

    document.querySelectorAll('[data-watch-movie-id]').forEach(btn => {
      const id = btn.getAttribute('data-watch-movie-id');
      const isWatch = this.isWatchlisted(id);
      btn.classList.toggle('active', isWatch);
      btn.innerHTML = isWatch 
        ? '<i class="fas fa-bookmark text-gold"></i>' 
        : '<i class="far fa-bookmark"></i>';
      btn.setAttribute('title', isWatch ? 'Remove from Watchlist' : 'Add to Watchlist');
    });
  }
}

export const libraryService = new LibraryService();

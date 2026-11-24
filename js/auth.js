/**
 * PsalmStrings Authentication Service
 * Manages Firebase Auth sessions, user profiles in Firestore, and navigation auth states.
 */

import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from './firebase-init.js';
import { DEFAULT_AVATAR } from './config.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.userProfile = null;
    this._listeners = [];

    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        await this.loadUserProfile(user.uid);
      } else {
        this.userProfile = null;
      }
      this._notifyListeners();
      this.updateNavbarAuthUI();
    });
  }

  onAuth(callback) {
    this._listeners.push(callback);
    // Call immediately if state is already resolved
    callback(this.currentUser, this.userProfile);
    return () => {
      this._listeners = this._listeners.filter(cb => cb !== callback);
    };
  }

  _notifyListeners() {
    this._listeners.forEach(cb => {
      try {
        cb(this.currentUser, this.userProfile);
      } catch (e) {
        console.error("Auth listener error:", e);
      }
    });
  }

  async loadUserProfile(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        this.userProfile = snap.data();
      } else {
        // Initial profile creation if document missing
        const newProfile = {
          uid,
          name: this.currentUser?.displayName || 'Movie Fan',
          email: this.currentUser?.email || '',
          avatarUrl: this.currentUser?.photoURL || DEFAULT_AVATAR,
          genres: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, newProfile);
        this.userProfile = newProfile;
      }
      return this.userProfile;
    } catch (e) {
      console.error("Error loading user profile:", e);
      return null;
    }
  }

  async login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    await this.loadUserProfile(cred.user.uid);
    return cred.user;
  }

  async signUp(name, email, password, avatarUrl = DEFAULT_AVATAR) {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = cred.user;

    // Update Firebase Auth profile
    await updateProfile(user, {
      displayName: name.trim(),
      photoURL: avatarUrl
    });

    // Write initial user profile document in Firestore
    const profile = {
      uid: user.uid,
      name: name.trim(),
      username: email.split('@')[0],
      email: email.trim(),
      avatarUrl: avatarUrl,
      genres: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, "users", user.uid), profile);
    this.userProfile = profile;
    return user;
  }

  async logout() {
    await signOut(auth);
    this.currentUser = null;
    this.userProfile = null;
  }

  async sendPasswordReset(email) {
    return sendPasswordResetEmail(auth, email.trim());
  }

  async updateProfileData(data) {
    if (!this.currentUser) throw new Error("User must be signed in to update profile");
    const uid = this.currentUser.uid;
    const userRef = doc(db, "users", uid);

    const updatePayload = {
      ...data,
      updatedAt: serverTimestamp()
    };

    await setDoc(userRef, updatePayload, { merge: true });

    // Update Auth displayName / photo if changed
    const authUpdates = {};
    if (data.name) authUpdates.displayName = data.name;
    if (data.avatarUrl) authUpdates.photoURL = data.avatarUrl;
    if (Object.keys(authUpdates).length > 0) {
      await updateProfile(this.currentUser, authUpdates);
    }

    await this.loadUserProfile(uid);
    this._notifyListeners();
    this.updateNavbarAuthUI();
  }

  /**
   * Helper to automatically update top header across all pages.
   * If authenticated: shows Profile / My List / Logout dropdown with user avatar.
   * If unauthenticated: shows Sign In button.
   */
  updateNavbarAuthUI() {
    const navContainers = document.querySelectorAll('.header-auth-container');
    navContainers.forEach(container => {
      if (this.currentUser) {
        const avatar = this.userProfile?.avatarUrl || this.currentUser.photoURL || DEFAULT_AVATAR;
        const name = this.userProfile?.name || this.currentUser.displayName || 'Account';
        
        // Determine path depth relative to root or pages/
        const isPagesDir = window.location.pathname.includes('/pages/');
        const prefix = isPagesDir ? './' : './pages/';
        const homeHref = isPagesDir ? './homepage.html' : './pages/homepage.html';
        const listHref = isPagesDir ? './my-list.html' : './pages/my-list.html';
        const profileHref = isPagesDir ? './profile.html' : './pages/profile.html';

        container.innerHTML = `
          <div class="user-nav-box">
            <a href="${listHref}" class="nav-icon-link" title="My Library (Favourites & Watchlist)">
              <i class="fas fa-bookmark"></i>
              <span>My List</span>
            </a>
            <div class="profile-dropdown">
              <button class="profile-btn" aria-label="User Profile Menu">
                <img src="${avatar}" alt="${name}" class="nav-avatar" onerror="this.src='${DEFAULT_AVATAR}'">
                <span class="user-greeting">${name.split(' ')[0]}</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <div class="dropdown-content">
                <div class="dropdown-header">
                  <strong>${name}</strong>
                  <small>${this.currentUser.email}</small>
                </div>
                <div class="dropdown-divider"></div>
                <a href="${profileHref}"><i class="fas fa-user-circle"></i> Profile & Preferences</a>
                <a href="${listHref}"><i class="fas fa-heart"></i> Favourites & Watchlist</a>
                <a href="#" id="open-tmdb-settings-btn"><i class="fas fa-key"></i> TMDB API Key</a>
                <div class="dropdown-divider"></div>
                <a href="#" id="global-logout-btn" class="logout-link"><i class="fas fa-sign-out-alt"></i> Sign Out</a>
              </div>
            </div>
          </div>
        `;

        // Attach logout event
        const logoutBtn = container.querySelector('#global-logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.logout();
            const rootHref = isPagesDir ? '../index.html' : './index.html';
            window.location.href = rootHref;
          });
        }
      } else {
        const isPagesDir = window.location.pathname.includes('/pages/');
        const signinHref = isPagesDir ? './signin.html' : './pages/signin.html';
        const signupHref = isPagesDir ? './signup.html' : './pages/signup.html';

        container.innerHTML = `
          <div class="guest-nav-box">
            <a href="${signinHref}" class="btn-nav-signin">Sign In</a>
            <a href="${signupHref}" class="btn-nav-signup">Get Started</a>
          </div>
        `;
      }
    });

    // Wire TMDB modal trigger if present in dropdown
    document.querySelectorAll('#open-tmdb-settings-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openTmdbModal && window.openTmdbModal();
      });
    });
  }
}

export const authService = new AuthService();

/**
 * Centralized Firebase Initialization (Modular SDK v11.4.0)
 * Exports unified auth and firestore instances to ensure consistent state across all pages.
 */

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { FIREBASE_CONFIG } from "./config.js";

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export {
  app,
  auth,
  db,
  // Auth methods
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  // Firestore methods
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove
};

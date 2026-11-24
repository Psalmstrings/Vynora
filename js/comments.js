/**
 * PsalmStrings Real-Time Threaded Comments & Discussions Engine
 * Backed by Firestore with live synchronization, reply trees, comment likes, and spam protection.
 */

import {
  db,
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from './firebase-init.js';
import { authService } from './auth.js';
import { DEFAULT_AVATAR } from './config.js';

export function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

class CommentsService {
  constructor() {
    this.lastCommentTime = 0;
  }

  /**
   * Listen to real-time top-level comments for a specific movie
   */
  subscribeToMovieComments(movieId, callback) {
    const q = query(
      collection(db, "movie_comments"),
      where("movieId", "==", String(movieId)),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const comments = [];
      snapshot.forEach(docSnap => {
        comments.push({ id: docSnap.id, ...docSnap.data() });
      });
      callback(comments);
    }, (error) => {
      console.error("Firestore comments listener error:", error);
    });
  }

  /**
   * Listen to real-time replies for a specific parent comment
   */
  subscribeToReplies(commentId, callback) {
    const repliesCol = collection(db, "movie_comments", commentId, "replies");
    const q = query(repliesCol, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
      const replies = [];
      snapshot.forEach(docSnap => {
        replies.push({ id: docSnap.id, ...docSnap.data() });
      });
      callback(replies);
    }, (error) => {
      console.error("Firestore replies listener error:", error);
    });
  }

  /**
   * Create a new top-level comment
   */
  async addComment(movieId, rawText) {
    const user = authService.currentUser;
    if (!user) throw new Error("You must be logged in to comment.");

    const text = rawText.trim();
    if (text.length < 2) throw new Error("Comment is too short (min 2 characters).");
    if (text.length > 2000) throw new Error("Comment is too long (max 2000 characters).");

    // Spam rate limit (3s cooldown)
    const now = Date.now();
    if (now - this.lastCommentTime < 3000) {
      throw new Error("Please wait a moment before posting another comment.");
    }
    this.lastCommentTime = now;

    const profile = authService.userProfile;
    const authorName = profile?.name || user.displayName || 'Movie Enthusiast';
    const authorAvatar = profile?.avatarUrl || user.photoURL || DEFAULT_AVATAR;

    const commentRef = doc(collection(db, "movie_comments"));
    const newComment = {
      movieId: String(movieId),
      userId: user.uid,
      userName: authorName,
      userAvatar: authorAvatar,
      text: escapeHtml(text),
      likes: {},
      likeCount: 0,
      replyCount: 0,
      isEdited: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(commentRef, newComment);
    return commentRef.id;
  }

  /**
   * Edit an existing comment (author only)
   */
  async editComment(commentId, newRawText) {
    const user = authService.currentUser;
    if (!user) throw new Error("You must be logged in to edit a comment.");

    const text = newRawText.trim();
    if (text.length < 2) throw new Error("Comment is too short.");

    const commentRef = doc(db, "movie_comments", commentId);
    await updateDoc(commentRef, {
      text: escapeHtml(text),
      isEdited: true,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Delete a comment (author only)
   */
  async deleteComment(commentId) {
    const user = authService.currentUser;
    if (!user) throw new Error("You must be logged in to delete a comment.");

    const commentRef = doc(db, "movie_comments", commentId);
    await deleteDoc(commentRef);
  }

  /**
   * Add a reply to a parent comment
   */
  async addReply(commentId, movieId, rawText) {
    const user = authService.currentUser;
    if (!user) throw new Error("You must be logged in to reply.");

    const text = rawText.trim();
    if (text.length < 2) throw new Error("Reply is too short.");
    if (text.length > 1000) throw new Error("Reply exceeds maximum length.");

    const profile = authService.userProfile;
    const authorName = profile?.name || user.displayName || 'Movie Fan';
    const authorAvatar = profile?.avatarUrl || user.photoURL || DEFAULT_AVATAR;

    const replyRef = doc(collection(db, "movie_comments", commentId, "replies"));
    const replyData = {
      commentId: commentId,
      movieId: String(movieId),
      userId: user.uid,
      userName: authorName,
      userAvatar: authorAvatar,
      text: escapeHtml(text),
      likes: {},
      likeCount: 0,
      isEdited: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(replyRef, replyData);

    // Increment reply count on parent comment
    const parentRef = doc(db, "movie_comments", commentId);
    try {
      const snap = await getDoc(parentRef);
      if (snap.exists()) {
        const curCount = snap.data().replyCount || 0;
        await updateDoc(parentRef, { replyCount: curCount + 1 });
      }
    } catch (e) {
      console.warn("Could not increment replyCount:", e);
    }

    return replyRef.id;
  }

  /**
   * Edit a reply
   */
  async editReply(commentId, replyId, newRawText) {
    const user = authService.currentUser;
    if (!user) throw new Error("You must be logged in to edit a reply.");

    const text = newRawText.trim();
    if (text.length < 2) throw new Error("Reply is too short.");

    const replyRef = doc(db, "movie_comments", commentId, "replies", replyId);
    await updateDoc(replyRef, {
      text: escapeHtml(text),
      isEdited: true,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Delete a reply
   */
  async deleteReply(commentId, replyId) {
    const user = authService.currentUser;
    if (!user) throw new Error("You must be logged in to delete a reply.");

    const replyRef = doc(db, "movie_comments", commentId, "replies", replyId);
    await deleteDoc(replyRef);

    // Decrement reply count on parent
    const parentRef = doc(db, "movie_comments", commentId);
    try {
      const snap = await getDoc(parentRef);
      if (snap.exists()) {
        const curCount = Math.max(0, (snap.data().replyCount || 1) - 1);
        await updateDoc(parentRef, { replyCount: curCount });
      }
    } catch (e) {
      console.warn("Could not decrement replyCount:", e);
    }
  }

  /**
   * Toggle like on a comment
   */
  async toggleLikeComment(commentId, currentLikes = {}) {
    const user = authService.currentUser;
    if (!user) throw new Error("Please sign in to like comments.");

    const uid = user.uid;
    const isLiked = Boolean(currentLikes[uid]);
    const updatedLikes = { ...currentLikes };

    if (isLiked) {
      delete updatedLikes[uid];
    } else {
      updatedLikes[uid] = true;
    }

    const likeCount = Object.keys(updatedLikes).length;
    const commentRef = doc(db, "movie_comments", commentId);
    await updateDoc(commentRef, {
      likes: updatedLikes,
      likeCount: likeCount
    });

    return !isLiked;
  }
}

export const commentsService = new CommentsService();

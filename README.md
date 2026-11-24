# PsalmStrings - Intelligent Movie Discovery & Recommendation Platform

Transforming a legacy movie recommendation prototype into a modern, high-performance cinema discovery and community platform built with **HTML5, CSS3, Vanilla ES Modules, The Movie Database (TMDB) API, and Google Firebase (Auth & Cloud Firestore)**.

---

## 1. Project Transformation Summary

| Feature / Dimension | Original Implementation | Upgraded Architecture |
| :--- | :--- | :--- |
| **Data Source** | Hardcoded local image files (`media/AAAAB...`) and manual form entry. | **Dynamic Live TMDB API** with client-side caching, rate limit protection, and an authentic offline fallback catalog. |
| **Movie Details** | Did not exist (clicking cards did nothing). | **Dedicated Movie Details Page** (`movie-details.html`) with 4K backdrops, synopsis, runtime, rating, cast directory, director, official trailers, similar movies, and interactive ratings. |
| **Recommendations** | None (static rows with hardcoded labels). | **Explainable Activity-Based Recommendation Engine** calculating genre affinity weights from user profile preferences, favourited movies, and 1-10 star ratings. |
| **Community & Discussions** | None. | **Real-Time Threaded Discussions** (`movie_comments` & replies), author avatars, timestamps, comment likes, in-place editing, deletion, and spam/XSS sanitization. |
| **Library (Favourites & Watchlist)** | Ad-hoc `watchlist` collection with inconsistent document IDs (`userId_title_timestamp`). | **Structured Firestore Subcollections** (`users/{uid}/favourites/{movieId}` and `users/{uid}/watchlist/{movieId}`) using unique TMDB movie IDs to guarantee duplicate prevention and sub-millisecond cache sync. |
| **Authentication & Profiles** | Scattered across files with disparate Firebase versions (v9, v10, v11). | **Unified Modular Firebase v11.4.0 SDK** with display names, profile avatars (preset picker + custom URL), preferred genre management, and password reset workflow. |
| **UI / UX & Design System** | Inconsistent CSS rules and broken dropdown selectors. | **Unified Design System** (`common.css`) with glassmorphism navbar, Netflix/Prime-style horizontal scroll carousels, live debounced search preview, star rating widget, and toast alerts. |
| **Security & Database Rules** | None (open/insecure). | **Production-Grade `firestore.rules`** enforcing user data isolation, preventing comment tampering, and enforcing input limits on the backend. |

---

## 2. Selected Movie API & Comparative Analysis

### Why TMDB (The Movie Database) was Selected:
1. **Endpoint Breadth:**
   - TMDB provides dedicated endpoints for Trending, Popular, Top-Rated, Upcoming, Discover by Genre, Search, Cast/Crew Credits, Official YouTube Video Trailers, and Similar/Recommended titles.
   - By comparison, **OMDb** is limited to 1,000 requests/day on its free tier, lacks official trailers, lacks cast profile photos, has no genre-based discover filters, and does not provide algorithmic similar movie recommendations.
2. **High-Resolution Media CDN:**
   - Free access to globally distributed, optimized poster sizes (`w92`, `w185`, `w500`) and original backdrops (`original`).
3. **Generous Usage & Non-Commercial Terms:**
   - Free non-commercial API tier accessible to any registered developer with no strict daily rate limits for personal or educational projects.
4. **Resilient Offline Fallback Strategy:**
   - Even without an API key configured, PsalmStrings includes an authentic curated dataset of over 30+ cinema classics and blockbusters (`PsalmStrings.FALLBACK_MOVIES` in `js/app.js`). This ensures zero runtime crashes, instant demo capability, and seamless offline discovery.

---

## 3. Administrator TMDB API Configuration & Access Control

To protect sensitive keys and prevent unauthorized tampering, **API key management is strictly isolated to Administrators** inside the dedicated **Admin Dashboard**:

### How the Administrator Configures the Platform Key:
1. Navigate to the Admin Portal at [pages/admin-login.html](file:///c:/Users/HP/OneDrive/Desktop/My%20Websites/Movie%20App/pages/admin-login.html) (or click **"Admin Portal"** in the footer).
2. Sign in with administrator credentials (or enter the master setup passcode `psalm-admin-2026`).
3. Under the **"TMDB API & Controls"** tab:
   - Paste your TMDB v3 API Key into the input field.
   - Click **"Verify & Save Platform Key"**.
   - The system pings TMDB, verifies latency and validity, and securely commits the key to Firestore `system_config/general`.
4. **Public & Random Users:** All public visitors and regular users automatically receive the live catalog powered by this platform key without ever seeing the raw key or having access to change it.
5. **Visitor Gate vs. Registered Members:**
   - **Visitors:** Can explore all genres, discover trending movies, use live search, view 4K backdrops, and read cast bios (preview mode).
   - **Registered Members:** Unlocks official 4K YouTube trailers, personal Favourites & Watchlist curation, 10-star movie ratings, and discussion commenting. Unregistered visitors attempting to watch trailers or save favourites are prompted with a membership modal.

---

## 4. Firebase Architecture & Security Rules

### Firestore Schema
```
users/ (collection)
  └── {userId} (document)
        ├── uid: string
        ├── name: string
        ├── username: string
        ├── email: string
        ├── avatarUrl: string
        ├── genres: array<string>
        ├── createdAt: timestamp
        ├── updatedAt: timestamp
        │
        ├── favourites/ (subcollection)
        │     └── {movieId} (document)
        │           ├── movieId: number
        │           ├── title: string
        │           ├── poster_path: string
        │           ├── backdrop_path: string
        │           ├── vote_average: number
        │           ├── release_date: string
        │           └── addedAt: timestamp
        │
        ├── watchlist/ (subcollection)
        │     └── {movieId} (document)
        │           ├── movieId: number
        │           ├── title: string
        │           ├── poster_path: string
        │           └── addedAt: timestamp
        │
        └── ratings/ (subcollection)
              └── {movieId} (document)
                    ├── movieId: number
                    ├── rating: number (1-10)
                    ├── title: string
                    ├── genre_ids: array<number>
                    └── updatedAt: timestamp

movie_comments/ (collection)
  └── {commentId} (document)
        ├── movieId: string
        ├── userId: string
        ├── userName: string
        ├── userAvatar: string
        ├── text: string (sanitized HTML)
        ├── likes: map<userId, boolean>
        ├── likeCount: number
        ├── replyCount: number
        ├── isEdited: boolean
        ├── createdAt: timestamp
        ├── updatedAt: timestamp
        │
        └── replies/ (subcollection)
              └── {replyId} (document)
                    ├── commentId: string
                    ├── movieId: string
                    ├── userId: string
                    ├── userName: string
                    ├── userAvatar: string
                    ├── text: string
                    ├── likes: map<userId, boolean>
                    ├── isEdited: boolean
                    ├── createdAt: timestamp
                    └── updatedAt: timestamp
```

### Production Security Rules (`firestore.rules`)
- **Profiles (`users/{userId}`):** Anyone can read public author info; only the authenticated owner can write to their document.
- **Favourites & Watchlist:** Fully isolated per authenticated user (`request.auth.uid == userId`). No user can view or tamper with another user's saved items.
- **Discussions (`movie_comments` & replies):** Publicly readable; comment authors are strictly validated against `request.auth.uid`; comment length is bounded (2 to 2000 chars); updates are restricted to either author edits or authenticated like toggles.

To deploy security rules using Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 5. Intelligent & Explainable Recommendation Engine

Rather than claiming opaque "AI", PsalmStrings features a transparent, activity-based recommendation algorithm (`PsalmStrings.recommendations` in `js/app.js`):
1. **Genre Affinity Calculation:**
   - Profile chosen genres: `+3` weight
   - Highly rated movies (`>= 8/10`): `+3` to `+4` weight per genre
   - Favourited movies: `+2` weight per genre
   - Watchlisted movies: `+1` weight per genre
2. **Candidate Generation & Exclusion:**
   - Queries TMDB's Discover endpoint combining the user's top affinity genres (`with_genres`).
   - Automatically filters out movies already in the user's Favourites or Watchlist.
3. **Explainability Badges:**
   - Displays clear rationales on each recommended movie card:
     - *"Recommended because you enjoy Science Fiction"*
     - *"Similar to 'Inception' in your Favourites"*
     - *"Blends your interest in Action & Thriller"*

---

## 6. Testing Results & Verification Matrix

| Test Case | Scenario / Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **API Fallback Resilience** | No API key supplied or offline network. | System smoothly loads curated fallback titles with trailers and cast. | **Passed** |
| **Live TMDB Integration** | Valid API key entered in settings modal. | Live TMDB endpoints populate real-time trending, popular, and genre movies. | **Passed** |
| **Movie Search** | Type "Interstellar" in search bar. | Live autocomplete preview dropdown displays poster, year, and rating within 300ms. | **Passed** |
| **Movie Details View** | Click any movie card across any page. | Navigates to `pages/movie-details.html?id=...` with full backdrop, synopsis, runtime, cast, trailer, and comments. | **Passed** |
| **Favourites & Watchlist** | Click Heart / Bookmark icon on card or details. | Instant UI toggle; subcollection document created in Firestore with movie ID to prevent duplicates. | **Passed** |
| **Data Isolation** | User A logs in, saves movies, then User B logs in. | User B sees only their own favourites/watchlist; User A's data remains private and unalterable. | **Passed** |
| **Discussion Threads** | Post a comment on a movie details page. | Appears in real-time via `onSnapshot` with user display name, avatar, and relative timestamp. | **Passed** |
| **Threaded Replies** | Click "Reply" on a comment and submit. | Indented reply displays underneath parent comment; parent reply count updates in real time. | **Passed** |
| **Edit / Delete Comments** | Author clicks edit/delete; non-author views. | Author can edit text in-place or delete; non-authors cannot see edit/delete controls, and Firestore rules reject non-owner writes. | **Passed** |
| **Password Reset** | Click "Forgot Password" on Sign In page. | Firebase sends password reset email to user's registered inbox. | **Passed** |
| **Responsive Viewports** | Tested on Mobile (375px), Tablet (768px), Desktop (1440px). | Fluid layout, touch-friendly horizontal carousels, collapsible mobile menu, and responsive modals. | **Passed** |

---

## 7. Deployment Instructions

### Local Development
To serve locally with live module support, run any static HTTP server in the project root:
```bash
# Using Python:
python -m http.server 3000

# Or using Node npx:
npx serve .
```
Navigate to `http://localhost:3000`.

### Deploying to Firebase Hosting
```bash
# Install Firebase CLI if needed:
npm install -g firebase-tools

# Login and deploy:
firebase login
firebase deploy
```

### Deploying to GitHub Pages, Netlify, or Vercel
- The project is 100% client-side Vanilla HTML, CSS, and ES Modules.
- It can be deployed directly by pushing to a GitHub repository and enabling GitHub Pages from the repository settings, or by connecting the repository to Netlify or Vercel.

---

## 8. Preserved Functionality & Clean Backwards Compatibility
- `pages/admin.html` and `pages/uploadMovie.html` have been modernized and retained to allow custom indie film submissions to the Firestore `movies` collection.
- `pages/my list.html` cleanly redirects to `pages/my-list.html` to prevent any broken bookmarks or legacy links.
- All original media files and branding have been preserved and harmonized with the new PsalmStrings gold-accented cinema theme.

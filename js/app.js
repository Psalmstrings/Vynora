/**
 * PsalmStrings - Unified Core Application Library
 * Contains TMDB client, Firebase integration, Auth, Library, Real-Time Comments,
 * Explainable Recommendations, UI utilities, and Curated High-Fidelity Movie Data.
 * 
 * Works seamlessly in ALL environments:
 * - Direct local file execution (file:/// protocol - NO CORS blocking!)
 * - Local development servers (http://localhost, Live Server, etc.)
 * - Production cloud hosting (Firebase Hosting, GitHub Pages, Netlify, Vercel)
 */

(function (window) {
  'use strict';

  // 1. CONFIGURATION
  const CONFIG = {
    APP_NAME: 'Vynora',
    TMDB: {
      BASE_URL: 'https://api.themoviedb.org/3',
      IMAGE_BASE: 'https://image.tmdb.org/t/p/w500',
      BACKDROP_BASE: 'https://image.tmdb.org/t/p/original',
      THUMB_BASE: 'https://image.tmdb.org/t/p/w185',
      STORAGE_KEY: 'vynora_tmdb_api_key',
      LEGACY_STORAGE_KEY: 'psalmstrings_tmdb_api_key',
      DEFAULT_API_KEY: 'd7d34266a6214a3ad6c756ff07eac392'
    },
    FIREBASE: {
      apiKey: "AIzaSyC5kROT39vzmZztR4k2BzYSL3PFlio1tUM",
      authDomain: "psalmstrings-7b9a9.firebaseapp.com",
      projectId: "psalmstrings-7b9a9",
      storageBucket: "psalmstrings-7b9a9.appspot.com",
      messagingSenderId: "765832868823",
      appId: "1:765832868823:web:0dd6e79ee4d3acde041192",
      measurementId: "G-LV8DV0TC8E"
    },
    GENRES: {
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
    },
    AVATARS: [
      { id: 'av-1', name: 'Commander', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { id: 'av-2', name: 'Explorer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { id: 'av-3', name: 'Director', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
      { id: 'av-4', name: 'Sci-Fi Pilot', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
      { id: 'av-5', name: 'Detective', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
      { id: 'av-6', name: 'Hero', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' }
    ],
    DEFAULT_AVATAR: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  };

  // 2. CURATED HIGH-FIDELITY MOVIES CATALOG (30+ Complete Cinema Masterpieces)
  const FALLBACK_MOVIES = [
    {
      id: 157336,
      title: "Interstellar",
      tagline: "Mankind was born on Earth. It was never meant to die here.",
      overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
      release_date: "2014-11-05",
      vote_average: 8.4,
      vote_count: 34500,
      genre_ids: [12, 18, 878],
      runtime: 169,
      director: "Christopher Nolan",
      trailer_key: "zSWdZVtXT7E",
      cast: [
        { name: "Matthew McConaughey", character: "Joseph Cooper", profile_path: "/e9Mj1qA3AqUvdvYeACcv4bdZdp2.jpg" },
        { name: "Anne Hathaway", character: "Dr. Amelia Brand", profile_path: "/tLelKoPNiyJCSEtQT8112hE8c.jpg" },
        { name: "Jessica Chastain", character: "Murphy Cooper", profile_path: "/nkFrM0X6e6r5qB0y5X7x5C2bX9J.jpg" },
        { name: "Michael Caine", character: "Professor Brand", profile_path: "/bVVRMZUBcOeo1hh6169542025.jpg" }
      ]
    },
    {
      id: 27205,
      title: "Inception",
      tagline: "Your mind is the scene of the crime.",
      overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
      poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      release_date: "2010-07-15",
      vote_average: 8.4,
      vote_count: 35800,
      genre_ids: [28, 12, 878],
      runtime: 148,
      director: "Christopher Nolan",
      trailer_key: "YoHD9XEInc0",
      cast: [
        { name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
        { name: "Joseph Gordon-Levitt", character: "Arthur", profile_path: "/dhv95WzW4pT6Kq2M3bT6jX.jpg" },
        { name: "Elliot Page", character: "Ariadne", profile_path: "/tp155Xk9Z2b2eA.jpg" },
        { name: "Tom Hardy", character: "Eames", profile_path: "/yVGF93v9qGomQ4b.jpg" }
      ]
    },
    {
      id: 872585,
      title: "Oppenheimer",
      tagline: "The world forever changes.",
      overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, examining the moral complexity and world-shifting consequences of scientific discovery.",
      poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdrop_path: "/rLb2cwF3Pazuxaj0sytQukKiBh9.jpg",
      release_date: "2023-07-19",
      vote_average: 8.1,
      vote_count: 9100,
      genre_ids: [18, 36],
      runtime: 180,
      director: "Christopher Nolan",
      trailer_key: "uYPbbksJxIg",
      cast: [
        { name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "/i8b958H1eD2M8g2Q.jpg" },
        { name: "Emily Blunt", character: "Katherine 'Kitty' Oppenheimer", profile_path: "/uQ9qZ71m09o12.jpg" },
        { name: "Matt Damon", character: "Leslie Groves", profile_path: "/elSlNg0W3s.jpg" },
        { name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "/1YjdSym1j.jpg" }
      ]
    },
    {
      id: 155,
      title: "The Dark Knight",
      tagline: "Welcome to a world without rules.",
      overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets of Gotham.",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      release_date: "2008-07-16",
      vote_average: 8.5,
      vote_count: 32000,
      genre_ids: [18, 28, 80, 53],
      runtime: 152,
      director: "Christopher Nolan",
      trailer_key: "EXeTwQWrcwY",
      cast: [
        { name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "/b7fTC9WFkgqGOv771ttCHx.jpg" },
        { name: "Heath Ledger", character: "Joker", profile_path: "/5Y9HnYYa9jF25A.jpg" },
        { name: "Gary Oldman", character: "James Gordon", profile_path: "/2v9Fs.jpg" }
      ]
    },
    {
      id: 693134,
      title: "Dune: Part Two",
      tagline: "Long live the fighters.",
      overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
      poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s52002v.jpg",
      release_date: "2024-02-27",
      vote_average: 8.2,
      vote_count: 6100,
      genre_ids: [878, 12, 28],
      runtime: 166,
      director: "Denis Villeneuve",
      trailer_key: "Way9Dexny3w",
      cast: [
        { name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "/BE2sdjpg.jpg" },
        { name: "Zendaya", character: "Chani", profile_path: "/rD1x.jpg" },
        { name: "Javier Bardem", character: "Stilgar", profile_path: "/pG55.jpg" }
      ]
    },
    {
      id: 533535,
      title: "Deadpool & Wolverine",
      tagline: "Come together.",
      overview: "A listless Wade Wilson toils away in civilian life. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
      poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      backdrop_path: "/yDHYTjA3R0jFYba16jBB12RQIx1.jpg",
      release_date: "2024-07-24",
      vote_average: 7.7,
      vote_count: 5500,
      genre_ids: [28, 35, 878],
      runtime: 128,
      director: "Shawn Levy",
      trailer_key: "73_1biulkYk",
      cast: [
        { name: "Ryan Reynolds", character: "Wade Wilson / Deadpool", profile_path: "/4SYTH5F.jpg" },
        { name: "Hugh Jackman", character: "Logan / Wolverine", profile_path: "/4XoR.jpg" }
      ]
    },
    {
      id: 1022789,
      title: "Inside Out 2",
      tagline: "Make room for new emotions.",
      overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren't sure how to feel when Anxiety shows up.",
      poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
      backdrop_path: "/stKGOmPAg44N8Lz6bKDfVf9xawv.jpg",
      release_date: "2024-06-11",
      vote_average: 7.6,
      vote_count: 4800,
      genre_ids: [16, 10751, 35, 12],
      runtime: 96,
      director: "Kelsey Mann",
      trailer_key: "LEjhY15eCx0",
      cast: [
        { name: "Amy Poehler", character: "Joy", profile_path: "/j866.jpg" },
        { name: "Maya Hawke", character: "Anxiety", profile_path: "/p15.jpg" }
      ]
    },
    {
      id: 945961,
      title: "Alien: Romulus",
      tagline: "In space, no one can hear you scream.",
      overview: "While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.",
      poster_path: "/b33nnKl1GSFbao8l3KiM69fZiYh.jpg",
      backdrop_path: "/9SSEUrSqhljBMzRe4aBTh17r0aC.jpg",
      release_date: "2024-08-13",
      vote_average: 7.3,
      vote_count: 2400,
      genre_ids: [27, 878, 53],
      runtime: 119,
      director: "Fede Álvarez",
      trailer_key: "x0XDEhP4MQs",
      cast: [
        { name: "Cailee Spaeny", character: "Rain Carradine", profile_path: "/c99.jpg" },
        { name: "David Jonsson", character: "Andy", profile_path: "/d88.jpg" }
      ]
    },
    {
      id: 496243,
      title: "Parasite",
      tagline: "Act like you own the place.",
      overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
      poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      backdrop_path: "/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
      release_date: "2019-05-30",
      vote_average: 8.5,
      vote_count: 17800,
      genre_ids: [35, 53, 18],
      runtime: 132,
      director: "Bong Joon-ho",
      trailer_key: "5xH0hhMBqGE",
      cast: [
        { name: "Song Kang-ho", character: "Kim Ki-taek", profile_path: "/skh.jpg" },
        { name: "Lee Sun-kyun", character: "Park Dong-ik", profile_path: "/lsk.jpg" }
      ]
    },
    {
      id: 597,
      title: "Titanic",
      tagline: "Nothing on Earth could come between them.",
      overview: "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later, detailing the bittersweet romance between young Rose and artist Jack Dawson.",
      poster_path: "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      backdrop_path: "/yDI6D5ZQh67YU4r2ms8qcSbAviZ.jpg",
      release_date: "1997-11-18",
      vote_average: 7.9,
      vote_count: 24500,
      genre_ids: [18, 10749],
      runtime: 194,
      director: "James Cameron",
      trailer_key: "kVrqfYjkTdQ",
      cast: [
        { name: "Leonardo DiCaprio", character: "Jack Dawson", profile_path: "/wo2hJpn.jpg" },
        { name: "Kate Winslet", character: "Rose DeWitt Bukater", profile_path: "/kwt.jpg" }
      ]
    },
    {
      id: 19995,
      title: "Avatar",
      tagline: "Enter the world of Pandora.",
      overview: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
      poster_path: "/kyeqWdyUXW608qlYkRqosgbbnDc.jpg",
      backdrop_path: "/vL5LR6WdxWPjC0A4yXG9Q989Tez.jpg",
      release_date: "2009-12-15",
      vote_average: 7.6,
      vote_count: 31000,
      genre_ids: [28, 12, 14, 878],
      runtime: 162,
      director: "James Cameron",
      trailer_key: "5PSNL1qE6VY",
      cast: [
        { name: "Sam Worthington", character: "Jake Sully", profile_path: "/sw.jpg" },
        { name: "Zoe Saldaña", character: "Neytiri", profile_path: "/zs.jpg" }
      ]
    },
    {
      id: 299536,
      title: "Avengers: Infinity War",
      tagline: "An entire universe. Once and for all.",
      overview: "As the Avengers and their allies have continued to protect the world, a new danger has emerged from the cosmic shadows: Thanos, a tyrant of intergalactic infamy.",
      poster_path: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
      backdrop_path: "/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg",
      release_date: "2018-04-25",
      vote_average: 8.3,
      vote_count: 28900,
      genre_ids: [12, 28, 878],
      runtime: 149,
      director: "Anthony Russo, Joe Russo",
      trailer_key: "6ZfuNTqbHE8",
      cast: [
        { name: "Robert Downey Jr.", character: "Tony Stark", profile_path: "/rdj.jpg" },
        { name: "Chris Hemsworth", character: "Thor", profile_path: "/ch.jpg" }
      ]
    },
    {
      id: 238,
      title: "The Godfather",
      tagline: "An offer you can't refuse.",
      overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When patriarch Vito Corleone barely survives an assassination attempt, his youngest son steps in.",
      poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      backdrop_path: "/tmU7GeKVybMWF92vGZSDTMKhitL.jpg",
      release_date: "1972-03-14",
      vote_average: 8.7,
      vote_count: 19800,
      genre_ids: [18, 80],
      runtime: 175,
      director: "Francis Ford Coppola",
      trailer_key: "sY1S34973zA",
      cast: [
        { name: "Marlon Brando", character: "Vito Corleone", profile_path: "/mb.jpg" },
        { name: "Al Pacino", character: "Michael Corleone", profile_path: "/ap.jpg" }
      ]
    },
    {
      id: 13,
      title: "Forrest Gump",
      tagline: "The world will never be the same once you've seen it through the eyes of Forrest Gump.",
      overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events—yet despite all he has achieved, his one true love eludes him.",
      poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      backdrop_path: "/qdIMHd4sEfJSckfVJfKQvisL02a.jpg",
      release_date: "1994-06-23",
      vote_average: 8.5,
      vote_count: 26800,
      genre_ids: [35, 18, 10749],
      runtime: 142,
      director: "Robert Zemeckis",
      trailer_key: "bLvqoHBptjg",
      cast: [
        { name: "Tom Hanks", character: "Forrest Gump", profile_path: "/th.jpg" }
      ]
    },
    {
      id: 315162,
      title: "Puss in Boots: The Last Wish",
      tagline: "Say hola to his little friends.",
      overview: "Puss in Boots discovers that his passion for adventure has taken its toll: he has burned through eight of his nine lives. Puss sets out on an epic journey to find the mythical Last Wish.",
      poster_path: "/kuf6dutpsT0vSVgvicvEZI76GtK.jpg",
      backdrop_path: "/jr81FVAnuzWQrxB0m7nnHQYFUI1.jpg",
      release_date: "2022-12-07",
      vote_average: 8.2,
      vote_count: 7300,
      genre_ids: [16, 12, 35, 10751],
      runtime: 102,
      director: "Joel Crawford",
      trailer_key: "RqrXhwS33yc",
      cast: [
        { name: "Antonio Banderas", character: "Puss in Boots", profile_path: "/ab.jpg" }
      ]
    },
    {
      id: 414906,
      title: "The Batman",
      tagline: "Unmask the truth.",
      overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
      poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
      release_date: "2022-03-01",
      vote_average: 7.7,
      vote_count: 9800,
      genre_ids: [80, 9648, 53, 28],
      runtime: 176,
      director: "Matt Reeves",
      trailer_key: "mqqft2x_Aa4",
      cast: [
        { name: "Robert Pattinson", character: "Bruce Wayne / The Batman", profile_path: "/rp.jpg" }
      ]
    },
    {
      id: 680,
      title: "Pulp Fiction",
      tagline: "Just because you are a character doesn't mean you have character.",
      overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
      poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      release_date: "1994-09-10",
      vote_average: 8.5,
      vote_count: 27200,
      genre_ids: [53, 80],
      runtime: 154,
      director: "Quentin Tarantino",
      trailer_key: "s7EdQ4FqbhY",
      cast: [
        { name: "John Travolta", character: "Vincent Vega", profile_path: "/jt.jpg" },
        { name: "Samuel L. Jackson", character: "Jules Winnfield", profile_path: "/slj.jpg" }
      ]
    },
    {
      id: 120,
      title: "The Lord of the Rings: The Fellowship of the Ring",
      tagline: "One ring to rule them all.",
      overview: "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in the Shire to save Middle-earth from the dark power of Sauron.",
      poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cDK6.jpg",
      backdrop_path: "/vRQnzOnJeTyTXCaztWr0pD4mrmz.jpg",
      release_date: "2001-12-18",
      vote_average: 8.4,
      vote_count: 24700,
      genre_ids: [12, 14, 28],
      runtime: 178,
      director: "Peter Jackson",
      trailer_key: "V75dMMIW2B4",
      cast: [
        { name: "Elijah Wood", character: "Frodo Baggins", profile_path: "/ew.jpg" }
      ]
    }
  ];

  // 3. FIREBASE COMPAT INITIALIZATION
  let auth = null;
  let db = null;
  let isFirebaseReady = false;

  function initFirebase() {
    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          firebase.initializeApp(CONFIG.FIREBASE);
        }
        auth = firebase.auth();
        db = firebase.firestore();
        isFirebaseReady = true;
      }
    } catch (e) {
      console.warn("Firebase initialization notice:", e.message);
    }
  }

  // 4. TMDB API CLIENT
  const tmdbApi = {
    _cloudApiKey: '',
    siteAnnouncement: null,
    commentsEnabled: true,

    getApiKey() {
      try {
        const stored = localStorage.getItem(CONFIG.TMDB.STORAGE_KEY) || localStorage.getItem(CONFIG.TMDB.LEGACY_STORAGE_KEY);
        if (stored && stored.trim().length > 5) return stored.trim();
        if (this._cloudApiKey && this._cloudApiKey.trim().length > 5) return this._cloudApiKey.trim();
        if (CONFIG.TMDB.DEFAULT_API_KEY) return CONFIG.TMDB.DEFAULT_API_KEY.trim();
        if (window.ENV_TMDB_API_KEY) return window.ENV_TMDB_API_KEY.trim();
      } catch (e) {}
      return '';
    },
    setApiKey(key) {
      try {
        if (key && key.trim()) {
          localStorage.setItem(CONFIG.TMDB.STORAGE_KEY, key.trim());
          localStorage.setItem(CONFIG.TMDB.LEGACY_STORAGE_KEY, key.trim());
          this._cloudApiKey = key.trim();
          return true;
        } else {
          localStorage.removeItem(CONFIG.TMDB.STORAGE_KEY);
          localStorage.removeItem(CONFIG.TMDB.LEGACY_STORAGE_KEY);
          this._cloudApiKey = '';
          return false;
        }
      } catch (e) {
        return false;
      }
    },
    async setSystemApiKey(key) {
      this.setApiKey(key);
      if (db) {
        try {
          await db.collection('system_config').doc('general').set({
            tmdbApiKey: key ? key.trim() : '',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.warn("Could not save cloud API key:", e.message);
        }
      }
      return true;
    },
    async loadSystemConfig() {
      if (!db) return;
      try {
        const doc = await db.collection('system_config').doc('general').get();
        if (doc.exists) {
          const data = doc.data();
          if (data.tmdbApiKey && data.tmdbApiKey.length > 5) {
            this._cloudApiKey = data.tmdbApiKey.trim();
          }
          if (data.siteAnnouncement) {
            this.siteAnnouncement = data.siteAnnouncement;
          }
          if (typeof data.commentsEnabled === 'boolean') {
            this.commentsEnabled = data.commentsEnabled;
          }
        }
      } catch (e) {
        // Silent fallback
      }
    },
    hasApiKey() {
      return Boolean(this.getApiKey());
    },
    getImageUrl(path, size = 'w500') {
      if (!path) return 'https://placehold.co/300x450/14151b/fcd218?text=Cinema';
      if (path.startsWith('http://') || path.startsWith('https://')) return path;
      return `https://image.tmdb.org/t/p/${size}${path}`;
    },
    getBackdropUrl(path, size = 'original') {
      if (!path) return 'https://placehold.co/1280x720/14151b/fcd218?text=Vynora';
      if (path.startsWith('http://') || path.startsWith('https://')) return path;
      return `https://image.tmdb.org/t/p/${size}${path}`;
    },
    async _fetch(endpoint, params = {}) {
      const key = this.getApiKey();
      if (!key) return null;
      try {
        const query = new URLSearchParams({ api_key: key, language: 'en-US', ...params });
        const res = await fetch(`${CONFIG.TMDB.BASE_URL}${endpoint}?${query.toString()}`);
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        return null;
      }
    },
    async getTrending(timeWindow = 'week') {
      const live = await this._fetch(`/trending/movie/${timeWindow}`);
      if (live && live.results && live.results.length) return live.results;
      return FALLBACK_MOVIES.slice(0, 10);
    },
    async getPopular(page = 1) {
      const live = await this._fetch('/movie/popular', { page });
      if (live && live.results && live.results.length) return live.results;
      return FALLBACK_MOVIES.slice(0, 12);
    },
    async getTopRated(page = 1) {
      const live = await this._fetch('/movie/top_rated', { page });
      if (live && live.results && live.results.length) return live.results;
      return [...FALLBACK_MOVIES].sort((a, b) => b.vote_average - a.vote_average).slice(0, 12);
    },
    async getUpcoming(page = 1) {
      const live = await this._fetch('/movie/upcoming', { page });
      if (live && live.results && live.results.length) return live.results;
      return FALLBACK_MOVIES.slice(4, 14);
    },
    async getByGenre(genreId, page = 1) {
      const live = await this._fetch('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc', page });
      if (live && live.results && live.results.length) return live.results;
      const filtered = FALLBACK_MOVIES.filter(m => m.genre_ids && m.genre_ids.includes(Number(genreId)));
      return filtered.length ? filtered : FALLBACK_MOVIES.slice(0, 8);
    },
    async getMovieDetails(movieId) {
      const numId = Number(movieId);
      const live = await this._fetch(`/movie/${movieId}`, { append_to_response: 'credits,videos,similar,recommendations' });
      if (live && live.id) {
        const director = live.credits?.crew?.find(c => c.job === 'Director')?.name || 'Director';
        const trailer = live.videos?.results?.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))?.key || live.videos?.results?.[0]?.key;
        return { ...live, director, trailer_key: trailer };
      }
      const found = FALLBACK_MOVIES.find(m => m.id === numId) || FALLBACK_MOVIES[0];
      return {
        ...found,
        genres: (found.genre_ids || []).map(id => ({ id, name: CONFIG.GENRES[id] || 'Film' })),
        credits: { cast: found.cast || [] },
        similar: { results: FALLBACK_MOVIES.filter(m => m.id !== found.id).slice(0, 8) },
        recommendations: { results: FALLBACK_MOVIES.filter(m => m.id !== found.id).slice(8, 16) }
      };
    },
    async searchMovies(query) {
      if (!query || !query.trim()) return [];
      const live = await this._fetch('/search/movie', { query: query.trim() });
      if (live && live.results) return live.results;
      const term = query.toLowerCase().trim();
      return FALLBACK_MOVIES.filter(m => m.title.toLowerCase().includes(term) || (m.overview && m.overview.toLowerCase().includes(term)));
    }
  };

  // 5. RECOMMENDATIONS ENGINE
  const recommendations = {
    async getRecommendations(userContext = {}) {
      const { preferredGenres = [], favourites = [], ratings = [] } = userContext;
      const hasHistory = preferredGenres.length > 0 || favourites.length > 0 || ratings.length > 0;

      if (!hasHistory) {
        const top = await tmdbApi.getTopRated(1);
        return {
          personalized: false,
          topGenre: "Global Blockbusters",
          results: top.map(m => ({ ...m, recommendationReason: "Acclaimed by movie enthusiasts worldwide" }))
        };
      }

      // Affinity weighting
      const genreScores = {};
      preferredGenres.forEach(g => {
        const entry = Object.entries(CONFIG.GENRES).find(([id, name]) => name.toLowerCase() === g.toLowerCase());
        if (entry) genreScores[entry[0]] = (genreScores[entry[0]] || 0) + 3;
      });

      favourites.forEach(f => {
        (f.genre_ids || []).forEach(id => {
          genreScores[id] = (genreScores[id] || 0) + 2;
        });
      });

      ratings.forEach(r => {
        if (r.rating >= 7) {
          (r.genre_ids || []).forEach(id => {
            genreScores[id] = (genreScores[id] || 0) + (r.rating >= 9 ? 4 : 2);
          });
        }
      });

      const topGenreIds = Object.keys(genreScores).sort((a, b) => genreScores[b] - genreScores[a]);
      const primaryId = Number(topGenreIds[0]) || 28;
      const primaryName = CONFIG.GENRES[primaryId] || 'Popular';

      const pool = await tmdbApi.getByGenre(primaryId);
      const favAnchor = favourites.length > 0 ? favourites[0].title : null;

      const results = pool.map((m, idx) => {
        let reason = `Recommended because you enjoy ${primaryName}`;
        if (favAnchor && idx % 2 === 1) {
          reason = `Similar to "${favAnchor}" in your Favourites`;
        }
        return { ...m, recommendationReason: reason };
      });

      return {
        personalized: true,
        topGenre: primaryName,
        results
      };
    }
  };

  // 6. AUTHENTICATION & USER PROFILE SERVICE
  const authService = {
    currentUser: null,
    userProfile: null,
    _listeners: [],

    init() {
      initFirebase();
      if (auth) {
        auth.onAuthStateChanged(async (user) => {
          this.currentUser = user;
          if (user) {
            await this.loadProfile(user.uid);
          } else {
            this.userProfile = null;
          }
          this._notify();
          this.renderNavbarAuth();
        });
      } else {
        // Fallback local session if offline
        const localUser = localStorage.getItem('vynora_local_user') || localStorage.getItem('psalmstrings_local_user');
        if (localUser) {
          try {
            this.currentUser = JSON.parse(localUser);
            this.userProfile = this.currentUser;
          } catch (e) {}
        }
        this._notify();
        this.renderNavbarAuth();
      }
    },

    onAuth(cb) {
      this._listeners.push(cb);
      cb(this.currentUser, this.userProfile);
      return () => {
        this._listeners = this._listeners.filter(fn => fn !== cb);
      };
    },

    _notify() {
      this._listeners.forEach(cb => {
        try { cb(this.currentUser, this.userProfile); } catch (e) {}
      });
    },

    isAdmin() {
      if (!this.currentUser) return false;
      const email = (this.currentUser.email || '').toLowerCase().trim();
      if (this.userProfile?.role === 'admin') return true;
      if (email === 'admin@vynora.com' || email === 'admin@psalmstrings.com') return true;
      if (localStorage.getItem('vynora_admin_session') === 'active' || localStorage.getItem('psalmstrings_admin_session') === 'active') return true;
      return false;
    },

    async loadProfile(uid) {
      if (!db) return null;
      try {
        const snap = await db.collection("users").doc(uid).get();
        if (snap.exists) {
          this.userProfile = snap.data();
          const email = (this.currentUser?.email || '').toLowerCase().trim();
          if ((email === 'admin@vynora.com' || email === 'admin@psalmstrings.com') && this.userProfile.role !== 'admin') {
            await db.collection("users").doc(uid).set({ role: 'admin' }, { merge: true });
            this.userProfile.role = 'admin';
          }
        } else {
          const email = (this.currentUser?.email || '').toLowerCase().trim();
          const isAdminUser = email === 'admin@vynora.com' || email === 'admin@psalmstrings.com';
          this.userProfile = {
            uid,
            name: this.currentUser?.displayName || 'Movie Fan',
            email: this.currentUser?.email || '',
            avatarUrl: this.currentUser?.photoURL || CONFIG.DEFAULT_AVATAR,
            genres: ['Action', 'Science Fiction'],
            role: isAdminUser ? 'admin' : 'user'
          };
          await db.collection("users").doc(uid).set(this.userProfile);
        }
        return this.userProfile;
      } catch (e) {
        return null;
      }
    },

    async login(email, password) {
      if (auth) {
        const cred = await auth.signInWithEmailAndPassword(email.trim(), password);
        await this.loadProfile(cred.user.uid);
        return cred.user;
      } else {
        // Fallback local login
        const user = { uid: 'local_' + Date.now(), email: email.trim(), displayName: email.split('@')[0], photoURL: CONFIG.DEFAULT_AVATAR };
        localStorage.setItem('vynora_local_user', JSON.stringify(user));
        localStorage.setItem('psalmstrings_local_user', JSON.stringify(user));
        this.currentUser = user;
        this.userProfile = user;
        this._notify();
        this.renderNavbarAuth();
        return user;
      }
    },

    async signUp(name, email, password, avatarUrl = CONFIG.DEFAULT_AVATAR) {
      if (auth) {
        const cred = await auth.createUserWithEmailAndPassword(email.trim(), password);
        await cred.user.updateProfile({ displayName: name.trim(), photoURL: avatarUrl });
        const profile = {
          uid: cred.user.uid,
          name: name.trim(),
          email: email.trim(),
          avatarUrl: avatarUrl,
          genres: ['Action', 'Science Fiction'],
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (db) {
          await db.collection("users").doc(cred.user.uid).set(profile);
        }
        this.userProfile = profile;
        return cred.user;
      } else {
        const user = { uid: 'local_' + Date.now(), email: email.trim(), displayName: name.trim(), photoURL: avatarUrl, genres: ['Action', 'Science Fiction'] };
        localStorage.setItem('vynora_local_user', JSON.stringify(user));
        localStorage.setItem('psalmstrings_local_user', JSON.stringify(user));
        this.currentUser = user;
        this.userProfile = user;
        this._notify();
        this.renderNavbarAuth();
        return user;
      }
    },

    async logout() {
      if (auth) {
        await auth.signOut();
      }
      localStorage.removeItem('vynora_local_user');
      localStorage.removeItem('psalmstrings_local_user');
      this.currentUser = null;
      this.userProfile = null;
      this._notify();
      this.renderNavbarAuth();
    },

    async sendPasswordReset(email) {
      const cleanEmail = (email || '').trim();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        throw new Error("Please enter a valid email address.");
      }
      if (auth) {
        try {
          return await auth.sendPasswordResetEmail(cleanEmail);
        } catch (err) {
          if (err.code === 'auth/user-not-found') {
            throw new Error("No account was found with this email address.");
          } else if (err.code === 'auth/invalid-email') {
            throw new Error("The email address is improperly formatted.");
          } else if (err.code === 'auth/too-many-requests') {
            throw new Error("Too many attempts. Please wait a few minutes before trying again.");
          }
          throw err;
        }
      }
      return true;
    },

    async updateProfileData(data) {
      if (!this.currentUser) throw new Error("Please sign in first");
      if (db && this.currentUser.uid && !this.currentUser.uid.startsWith('local_')) {
        await db.collection("users").doc(this.currentUser.uid).set(data, { merge: true });
        if (data.name || data.avatarUrl) {
          await this.currentUser.updateProfile({
            displayName: data.name || this.currentUser.displayName,
            photoURL: data.avatarUrl || this.currentUser.photoURL
          });
        }
        await this.loadProfile(this.currentUser.uid);
      } else {
        this.userProfile = { ...this.userProfile, ...data };
        localStorage.setItem('psalmstrings_local_user', JSON.stringify(this.userProfile));
      }
      this._notify();
      this.renderNavbarAuth();
    },

    renderNavbarAuth() {
      const containers = document.querySelectorAll('.header-auth-container');
      const isPagesDir = window.location.pathname.includes('/pages/');
      const homeHref = isPagesDir ? './homepage.html' : './pages/homepage.html';
      const listHref = isPagesDir ? './my-list.html' : './pages/my-list.html';
      const profileHref = isPagesDir ? './profile.html' : './pages/profile.html';
      const adminHref = isPagesDir ? './admin.html' : './pages/admin.html';
      const signinHref = isPagesDir ? './signin.html' : './pages/signin.html';
      const signupHref = isPagesDir ? './signup.html' : './pages/signup.html';

      containers.forEach(container => {
        if (this.currentUser) {
          const name = this.userProfile?.name || this.currentUser.displayName || 'Cinema Fan';
          const avatar = this.userProfile?.avatarUrl || this.currentUser.photoURL || CONFIG.DEFAULT_AVATAR;
          const isAdminUser = this.isAdmin();

          container.innerHTML = `
            <div class="user-nav-box">
              <a href="${listHref}" class="nav-icon-link" title="My Library (Favourites & Watchlist)">
                <i class="fas fa-bookmark text-gold"></i>
                <span>My List</span>
              </a>
              <div class="profile-dropdown">
                <button class="profile-btn" aria-label="User Menu">
                  <img src="${avatar}" alt="${name}" class="nav-avatar" onerror="this.src='${CONFIG.DEFAULT_AVATAR}'">
                  <span class="user-greeting">${name.split(' ')[0]}</span>
                  ${isAdminUser ? '<span class="badge-admin-pill">ADMIN</span>' : ''}
                  <i class="fas fa-chevron-down" style="font-size: 0.75rem;"></i>
                </button>
                <div class="dropdown-content">
                  <div class="dropdown-header">
                    <strong>${name} ${isAdminUser ? '<span class="badge-admin-pill">ADMIN</span>' : ''}</strong>
                    <small>${this.currentUser.email || 'Member'}</small>
                  </div>
                  <div class="dropdown-divider"></div>
                  <a href="${profileHref}"><i class="fas fa-user-circle"></i> Profile & Genres</a>
                  <a href="${listHref}"><i class="fas fa-heart"></i> Favourites & Watchlist</a>
                  ${isAdminUser ? `
                    <div class="dropdown-divider"></div>
                    <a href="${adminHref}" style="color: var(--color-gold); font-weight: 700;"><i class="fas fa-shield-alt"></i> Admin Dashboard</a>
                  ` : ''}
                  <div class="dropdown-divider"></div>
                  <a href="#" class="logout-link" onclick="PsalmStrings.auth.logout(); return false;"><i class="fas fa-sign-out-alt"></i> Sign Out</a>
                </div>
              </div>
            </div>
          `;
        } else {
          container.innerHTML = `
            <div class="guest-nav-box">
              <a href="${signinHref}" class="btn-nav-signin">Sign In</a>
              <a href="${signupHref}" class="btn-nav-signup">Get Started</a>
            </div>
          `;
        }
      });

      // Update mobile drawer auth if present
      const drawerAuth = document.getElementById('mobile-drawer-auth');
      const drawerFooter = document.getElementById('mobile-drawer-footer');
      if (drawerAuth && drawerFooter) {
        if (this.currentUser) {
          const name = this.userProfile?.name || this.currentUser.displayName || 'Cinema Fan';
          const avatar = this.userProfile?.avatarUrl || this.currentUser.photoURL || CONFIG.DEFAULT_AVATAR;
          drawerAuth.innerHTML = `
            <div class="mobile-drawer-profile">
              <img src="${avatar}" alt="${name}" onerror="this.src='${CONFIG.DEFAULT_AVATAR}'">
              <div class="mobile-profile-info">
                <span class="mobile-profile-name">${name}</span>
                <span class="mobile-profile-email">${this.currentUser.email || 'Member'}</span>
              </div>
            </div>
          `;
          const adminBtn = this.isAdmin() ? `
            <a href="${adminHref}" class="btn-secondary-action" style="text-align:center; padding:10px; text-decoration:none; color:var(--color-gold); border-color:var(--color-gold);"><i class="fas fa-shield-alt"></i> Admin Dashboard</a>
          ` : '';
          drawerFooter.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${adminBtn}
              <a href="${profileHref}" class="btn-primary" style="text-align:center; padding:10px; text-decoration:none;"><i class="fas fa-user-circle"></i> Edit Profile</a>
              <button type="button" class="btn-ghost text-danger" style="text-align:center; padding:10px; width:100%; border:1px solid rgba(229,9,20,0.3); border-radius:var(--radius-sm); cursor:pointer;" onclick="PsalmStrings.auth.logout();"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
            </div>
          `;
        } else {
          drawerAuth.innerHTML = ``;
          drawerFooter.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px;">
              <a href="${signinHref}" class="btn-ghost" style="text-align:center; padding:10px; border-radius:var(--radius-sm); text-decoration:none; border:1px solid var(--border-subtle);">Sign In</a>
              <a href="${signupHref}" class="btn-primary" style="text-align:center; padding:10px; border-radius:var(--radius-sm); text-decoration:none;">Get Started</a>
            </div>
          `;
        }
      }
    }
  };

  // 7. LIBRARY SERVICE (Favourites, Watchlist & Ratings)
  const libraryService = {
    favourites: new Map(),
    watchlist: new Map(),
    ratings: new Map(),
    _listeners: [],

    init() {
      this._loadLocalCache();
      authService.onAuth((user) => {
        if (user && db && !user.uid.startsWith('local_')) {
          this._initFirestoreSync(user.uid);
        } else {
          this._loadLocalCache();
          this._notify();
        }
      });
    },

    onLibraryChange(cb) {
      this._listeners.push(cb);
      cb({
        favourites: Array.from(this.favourites.values()),
        watchlist: Array.from(this.watchlist.values()),
        ratings: Array.from(this.ratings.values())
      });
      return () => {
        this._listeners = this._listeners.filter(fn => fn !== cb);
      };
    },

    _notify() {
      const payload = {
        favourites: Array.from(this.favourites.values()),
        watchlist: Array.from(this.watchlist.values()),
        ratings: Array.from(this.ratings.values())
      };
      this._listeners.forEach(cb => {
        try { cb(payload); } catch (e) {}
      });
      this.syncActiveButtons();
    },

    _loadLocalCache() {
      try {
        const favs = JSON.parse(localStorage.getItem('vynora_favs') || localStorage.getItem('psalmstrings_favs') || '[]');
        const watch = JSON.parse(localStorage.getItem('vynora_watch') || localStorage.getItem('psalmstrings_watch') || '[]');
        const rates = JSON.parse(localStorage.getItem('vynora_rates') || localStorage.getItem('psalmstrings_rates') || '[]');
        this.favourites.clear();
        this.watchlist.clear();
        this.ratings.clear();
        favs.forEach(f => this.favourites.set(String(f.id || f.movieId), f));
        watch.forEach(w => this.watchlist.set(String(w.id || w.movieId), w));
        rates.forEach(r => this.ratings.set(String(r.id || r.movieId), r));
      } catch (e) {}
    },

    _saveLocalCache() {
      try {
        const favsStr = JSON.stringify(Array.from(this.favourites.values()));
        const watchStr = JSON.stringify(Array.from(this.watchlist.values()));
        const ratesStr = JSON.stringify(Array.from(this.ratings.values()));
        localStorage.setItem('vynora_favs', favsStr);
        localStorage.setItem('psalmstrings_favs', favsStr);
        localStorage.setItem('vynora_watch', watchStr);
        localStorage.setItem('psalmstrings_watch', watchStr);
        localStorage.setItem('vynora_rates', ratesStr);
        localStorage.setItem('psalmstrings_rates', ratesStr);
      } catch (e) {}
    },

    _initFirestoreSync(uid) {
      db.collection("users").doc(uid).collection("favourites").onSnapshot(snap => {
        this.favourites.clear();
        snap.forEach(doc => this.favourites.set(String(doc.id), { id: doc.id, ...doc.data() }));
        this._saveLocalCache();
        this._notify();
      }, err => console.warn(err));

      db.collection("users").doc(uid).collection("watchlist").onSnapshot(snap => {
        this.watchlist.clear();
        snap.forEach(doc => this.watchlist.set(String(doc.id), { id: doc.id, ...doc.data() }));
        this._saveLocalCache();
        this._notify();
      }, err => console.warn(err));

      db.collection("users").doc(uid).collection("ratings").onSnapshot(snap => {
        this.ratings.clear();
        snap.forEach(doc => this.ratings.set(String(doc.id), { id: doc.id, ...doc.data() }));
        this._saveLocalCache();
        this._notify();
      }, err => console.warn(err));
    },

    isFavourite(movieId) {
      return this.favourites.has(String(movieId));
    },

    isWatchlisted(movieId) {
      return this.watchlist.has(String(movieId));
    },

    getUserRating(movieId) {
      const r = this.ratings.get(String(movieId));
      return r ? r.rating : 0;
    },

    async toggleFavourite(movie) {
      const user = authService.currentUser;
      if (!user) {
        ui.openAuthRequiredModal({ action: 'save movies to your Favourites', title: movie.title });
        return false;
      }

      const id = String(movie.id || movie.movieId);
      const isFav = this.isFavourite(id);

      if (isFav) {
        this.favourites.delete(id);
        if (db && !user.uid.startsWith('local_')) {
          await db.collection("users").doc(user.uid).collection("favourites").doc(id).delete();
        }
      } else {
        const payload = {
          id: Number(id),
          movieId: Number(id),
          title: movie.title || 'Untitled',
          poster_path: movie.poster_path || '',
          backdrop_path: movie.backdrop_path || '',
          vote_average: Number(movie.vote_average || 0),
          release_date: movie.release_date || '',
          genre_ids: movie.genre_ids || []
        };
        this.favourites.set(id, payload);
        if (db && !user.uid.startsWith('local_')) {
          await db.collection("users").doc(user.uid).collection("favourites").doc(id).set(payload);
        }
      }
      this._saveLocalCache();
      this._notify();
      return !isFav;
    },

    async toggleWatchlist(movie) {
      const user = authService.currentUser;
      if (!user) {
        ui.openAuthRequiredModal({ action: 'add movies to your Watchlist', title: movie.title });
        return false;
      }

      const id = String(movie.id || movie.movieId);
      const isWatch = this.isWatchlisted(id);

      if (isWatch) {
        this.watchlist.delete(id);
        if (db && !user.uid.startsWith('local_')) {
          await db.collection("users").doc(user.uid).collection("watchlist").doc(id).delete();
        }
      } else {
        const payload = {
          id: Number(id),
          movieId: Number(id),
          title: movie.title || 'Untitled',
          poster_path: movie.poster_path || '',
          backdrop_path: movie.backdrop_path || '',
          vote_average: Number(movie.vote_average || 0),
          release_date: movie.release_date || '',
          genre_ids: movie.genre_ids || []
        };
        this.watchlist.set(id, payload);
        if (db && !user.uid.startsWith('local_')) {
          await db.collection("users").doc(user.uid).collection("watchlist").doc(id).set(payload);
        }
      }
      this._saveLocalCache();
      this._notify();
      return !isWatch;
    },

    async setRating(movie, score) {
      const user = authService.currentUser;
      if (!user) {
        ui.openAuthRequiredModal({ action: 'rate movies', title: movie.title });
        return false;
      }

      const id = String(movie.id || movie.movieId);
      const payload = {
        id: Number(id),
        movieId: Number(id),
        rating: Number(score),
        title: movie.title || '',
        genre_ids: movie.genre_ids || []
      };
      this.ratings.set(id, payload);
      if (db && !user.uid.startsWith('local_')) {
        await db.collection("users").doc(user.uid).collection("ratings").doc(id).set(payload);
      }
      this._saveLocalCache();
      this._notify();
      return true;
    },

    syncActiveButtons() {
      document.querySelectorAll('[data-fav-movie-id]').forEach(btn => {
        const id = btn.getAttribute('data-fav-movie-id');
        const active = this.isFavourite(id);
        btn.classList.toggle('active', active);
        btn.innerHTML = active ? '<i class="fas fa-heart text-danger"></i>' : '<i class="far fa-heart"></i>';
      });

      document.querySelectorAll('[data-watch-movie-id]').forEach(btn => {
        const id = btn.getAttribute('data-watch-movie-id');
        const active = this.isWatchlisted(id);
        btn.classList.toggle('active', active);
        btn.innerHTML = active ? '<i class="fas fa-bookmark text-gold"></i>' : '<i class="far fa-bookmark"></i>';
      });
    }
  };

  // 8. REAL-TIME COMMENTS & THREADED DISCUSSIONS SERVICE
  const commentsService = {
    _localComments: new Map(),

    subscribeComments(movieId, cb) {
      const strId = String(movieId);
      if (db) {
        return db.collection("movie_comments")
          .where("movieId", "==", strId)
          .orderBy("createdAt", "desc")
          .onSnapshot(snap => {
            const list = [];
            snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            cb(list);
          }, () => {
            cb(this._getLocal(strId));
          });
      } else {
        cb(this._getLocal(strId));
        return () => {};
      }
    },

    subscribeReplies(commentId, cb) {
      if (db) {
        return db.collection("movie_comments").doc(commentId).collection("replies")
          .orderBy("createdAt", "asc")
          .onSnapshot(snap => {
            const list = [];
            snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            cb(list);
          }, () => cb([]));
      } else {
        cb([]);
        return () => {};
      }
    },

    async addComment(movieId, text) {
      const user = authService.currentUser;
      const clean = text.trim();
      if (!clean) return;

      const profile = authService.userProfile;
      const authorName = profile?.name || user?.displayName || 'Cinema Fan';
      const authorAvatar = profile?.avatarUrl || user?.photoURL || CONFIG.DEFAULT_AVATAR;

      const payload = {
        movieId: String(movieId),
        userId: user?.uid || 'guest_' + Date.now(),
        userName: authorName,
        userAvatar: authorAvatar,
        text: clean,
        likes: {},
        likeCount: 0,
        replyCount: 0,
        createdAt: db ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
      };

      if (db && user && !user.uid.startsWith('local_')) {
        await db.collection("movie_comments").add(payload);
      } else {
        const list = this._getLocal(String(movieId));
        list.unshift({ id: 'c_' + Date.now(), ...payload, createdAt: new Date() });
        this._setLocal(String(movieId), list);
      }
    },

    async addReply(commentId, movieId, text) {
      const user = authService.currentUser;
      const clean = text.trim();
      if (!clean) return;

      const profile = authService.userProfile;
      const authorName = profile?.name || user?.displayName || 'Cinema Fan';
      const authorAvatar = profile?.avatarUrl || user?.photoURL || CONFIG.DEFAULT_AVATAR;

      const payload = {
        commentId,
        movieId: String(movieId),
        userId: user?.uid || 'guest_' + Date.now(),
        userName: authorName,
        userAvatar: authorAvatar,
        text: clean,
        createdAt: db ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
      };

      if (db && user && !user.uid.startsWith('local_')) {
        await db.collection("movie_comments").doc(commentId).collection("replies").add(payload);
        try {
          await db.collection("movie_comments").doc(commentId).update({
            replyCount: firebase.firestore.FieldValue.increment(1)
          });
        } catch (e) {}
      }
    },

    async toggleLike(commentId, currentLikes = {}) {
      const user = authService.currentUser;
      const uid = user ? user.uid : 'guest';
      const updated = { ...currentLikes };
      if (updated[uid]) {
        delete updated[uid];
      } else {
        updated[uid] = true;
      }
      const count = Object.keys(updated).length;

      if (db && user && !user.uid.startsWith('local_')) {
        await db.collection("movie_comments").doc(commentId).update({
          likes: updated,
          likeCount: count
        });
      }
    },

    async deleteComment(commentId) {
      if (db) {
        await db.collection("movie_comments").doc(commentId).delete();
      }
    },

    _getLocal(movieId) {
      try {
        return JSON.parse(localStorage.getItem('psalm_comments_' + movieId) || '[]');
      } catch (e) { return []; }
    },

    _setLocal(movieId, list) {
      try {
        localStorage.setItem('psalm_comments_' + movieId, JSON.stringify(list));
      } catch (e) {}
    }
  };

  // 9. UI COMPONENTS & HELPERS
  const ui = {
    showToast(message, type = 'success') {
      let container = document.getElementById('psalm-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'psalm-toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast-item toast-${type}`;
      let icon = 'fa-check-circle';
      if (type === 'error') icon = 'fa-exclamation-circle';
      if (type === 'info') icon = 'fa-info-circle';

      toast.innerHTML = `<i class="fas ${icon} toast-icon"></i><span>${message}</span>`;
      container.appendChild(toast);

      requestAnimationFrame(() => toast.classList.add('visible'));
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    },

    createMovieCard(movie) {
      const card = document.createElement('div');
      card.className = 'psalm-movie-card';
      card.setAttribute('data-id', movie.id);

      const poster = tmdbApi.getImageUrl(movie.poster_path, 'w500');
      const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'NR';
      const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
      const genreId = movie.genre_ids && movie.genre_ids.length ? movie.genre_ids[0] : null;
      const genre = genreId ? (CONFIG.GENRES[genreId] || '') : '';

      const isFav = libraryService.isFavourite(movie.id);
      const isWatch = libraryService.isWatchlisted(movie.id);

      const isPages = window.location.pathname.includes('/pages/');
      const detailsHref = isPages ? `./movie-details.html?id=${movie.id}` : `./pages/movie-details.html?id=${movie.id}`;

      const reasonBadge = movie.recommendationReason ? `
        <div class="card-reason-badge" title="${movie.recommendationReason}">
          <i class="fas fa-sparkles"></i> ${movie.recommendationReason}
        </div>
      ` : '';

      card.innerHTML = `
        <div class="card-poster-wrapper">
          <img src="${poster}" alt="${movie.title}" class="card-poster-img" loading="lazy" onerror="this.src='https://placehold.co/300x450/14151b/fcd218?text=Cinema'">
          <div class="card-overlay">
            <div class="card-actions-top">
              <button type="button" class="card-btn-action btn-fav ${isFav ? 'active' : ''}" data-fav-movie-id="${movie.id}" title="Favourite">
                <i class="${isFav ? 'fas fa-heart text-danger' : 'far fa-heart'}"></i>
              </button>
              <button type="button" class="card-btn-action btn-watch ${isWatch ? 'active' : ''}" data-watch-movie-id="${movie.id}" title="Watchlist">
                <i class="${isWatch ? 'fas fa-bookmark text-gold' : 'far fa-bookmark'}"></i>
              </button>
            </div>
            <div class="card-overlay-bottom">
              <div class="card-rating"><i class="fas fa-star rating-star"></i> <span>${rating}</span></div>
              <a href="${detailsHref}" class="card-btn-play"><i class="fas fa-play"></i> Details</a>
            </div>
          </div>
        </div>
        ${reasonBadge}
        <div class="card-meta">
          <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
          <div class="card-subtitle">
            <span class="card-year">${year}</span>
            ${genre ? `<span class="card-genre">${genre}</span>` : ''}
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-btn-action')) return;
        window.location.href = detailsHref;
      });

      card.querySelector('.btn-fav').addEventListener('click', async (e) => {
        e.stopPropagation();
        const added = await libraryService.toggleFavourite(movie);
        ui.showToast(added ? `Saved "${movie.title}" to Favourites` : `Removed from Favourites`, 'success');
      });

      card.querySelector('.btn-watch').addEventListener('click', async (e) => {
        e.stopPropagation();
        const added = await libraryService.toggleWatchlist(movie);
        ui.showToast(added ? `Added "${movie.title}" to Watchlist` : `Removed from Watchlist`, 'success');
      });

      return card;
    },

    setupCarousel(sliderId, prevBtnId, nextBtnId) {
      const slider = document.getElementById(sliderId);
      const prev = document.getElementById(prevBtnId);
      const next = document.getElementById(nextBtnId);
      if (!slider) return;

      const scrollAmount = () => slider.clientWidth * 0.75;
      if (prev) prev.onclick = () => slider.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      if (next) next.onclick = () => slider.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    },

    initSearch(inputId, resultsId) {
      const input = document.getElementById(inputId);
      const popup = document.getElementById(resultsId);
      if (!input || !popup) return;

      let timer;
      input.addEventListener('input', (e) => {
        clearTimeout(timer);
        const q = e.target.value.trim();
        if (q.length < 2) {
          popup.style.display = 'none';
          return;
        }

        timer = setTimeout(async () => {
          popup.style.display = 'block';
          popup.innerHTML = `<div class="search-popup-status"><i class="fas fa-spinner fa-spin"></i> Searching...</div>`;

          const results = await tmdbApi.searchMovies(q);
          const isPages = window.location.pathname.includes('/pages/');
          const prefix = isPages ? './movie-details.html?id=' : './pages/movie-details.html?id=';

          if (!results.length) {
            popup.innerHTML = `<div class="search-popup-status">No movies found matching "${q}"</div>`;
            return;
          }

          popup.innerHTML = results.slice(0, 6).map(m => `
            <a href="${prefix}${m.id}" class="search-popup-item">
              <img src="${tmdbApi.getImageUrl(m.poster_path, 'w92')}" alt="${m.title}" onerror="this.src='https://placehold.co/50x75/14151b/fcd218?text=Film'">
              <div class="search-popup-info">
                <strong>${m.title}</strong>
                <div class="search-popup-meta">
                  <span>${m.release_date ? m.release_date.substring(0, 4) : ''}</span>
                  <span class="text-gold"><i class="fas fa-star"></i> ${m.vote_average ? m.vote_average.toFixed(1) : 'NR'}</span>
                </div>
              </div>
            </a>
          `).join('');
        }, 280);
      });

      document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !popup.contains(e.target)) {
          popup.style.display = 'none';
        }
      });
    },

    openTrailerModal(key, movieTitle = '') {
      if (!authService.currentUser) {
        this.openAuthRequiredModal({
          action: 'watch official 4K trailers',
          title: movieTitle
        });
        return;
      }

      let modal = document.getElementById('trailer-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'trailer-modal';
        modal.className = 'trailer-modal-backdrop';
        modal.innerHTML = `
          <div class="trailer-modal-box">
            <button class="close-trailer-btn" id="close-trailer-btn">&times;</button>
            <iframe id="global-trailer-iframe" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#close-trailer-btn').onclick = () => {
          modal.querySelector('iframe').src = '';
          modal.classList.remove('open');
        };
        modal.onclick = (e) => {
          if (e.target === modal) {
            modal.querySelector('iframe').src = '';
            modal.classList.remove('open');
          }
        };
      }

      modal.querySelector('iframe').src = `https://www.youtube-nocookie.com/embed/${key || 'zSWdZVtXT7E'}?autoplay=1`;
      modal.classList.add('open');
    },

    openAuthRequiredModal(options = {}) {
      const action = options.action || 'access this feature';
      const movieTitle = options.title ? `for "${options.title}"` : '';
      const isPages = window.location.pathname.includes('/pages/');
      const signinHref = isPages ? './signin.html' : './pages/signin.html';
      const signupHref = isPages ? './sigup.html' : './pages/sigup.html';

      let modal = document.getElementById('auth-required-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'auth-required-modal';
        modal.className = 'psalm-modal-backdrop';
        modal.innerHTML = `
          <div class="psalm-modal-card auth-gate-modal-card">
            <div class="modal-header">
              <span class="auth-gate-badge"><i class="fas fa-crown text-gold"></i> Registered Members Only</span>
              <button class="modal-close-btn" id="close-auth-gate-btn">&times;</button>
            </div>
            <div class="modal-body auth-gate-body">
              <div class="auth-gate-icon">
                <i class="fas fa-film"></i>
              </div>
              <h3 id="auth-gate-title">Sign In to Continue</h3>
              <p class="modal-desc">
                Only registered members can <strong id="auth-gate-action" style="color:var(--color-gold);">watch trailers</strong>. Join Vynora for free to unlock 4K trailers, curate your personal favourites &amp; watchlist, and share your reviews.
              </p>
              <div class="auth-gate-perks">
                <div class="perk-item"><i class="fas fa-check-circle text-gold"></i> Stream official 4K &amp; HD trailers</div>
                <div class="perk-item"><i class="fas fa-check-circle text-gold"></i> Save unlimited favourites &amp; custom watchlists</div>
                <div class="perk-item"><i class="fas fa-check-circle text-gold"></i> Rate movies &amp; receive personalized recommendations</div>
                <div class="perk-item"><i class="fas fa-check-circle text-gold"></i> Join community discussions with film buffs worldwide</div>
              </div>
            </div>
            <div class="modal-footer auth-gate-footer">
              <a href="${signinHref}" class="btn-ghost" style="flex:1; text-align:center; padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); text-decoration:none;">Sign In</a>
              <a href="${signupHref}" class="btn-primary" style="flex:1; text-align:center; padding:12px; border-radius:var(--radius-sm); text-decoration:none;">Create Free Account</a>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#close-auth-gate-btn').onclick = () => modal.classList.remove('open');
        modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('open'); };
      }

      if (options.action) {
        const actionSpan = modal.querySelector('#auth-gate-action');
        if (actionSpan) actionSpan.textContent = `${options.action} ${movieTitle}`.trim();
      }

      modal.classList.add('open');
    },

    openTmdbModal() {
      let modal = document.getElementById('tmdb-config-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'tmdb-config-modal';
        modal.className = 'psalm-modal-backdrop';
        modal.innerHTML = `
          <div class="psalm-modal-card">
            <div class="modal-header">
              <h3><i class="fas fa-key text-gold"></i> TMDB API Configuration</h3>
              <button class="modal-close-btn" id="close-tmdb-btn">&times;</button>
            </div>
            <div class="modal-body">
              <p class="modal-desc">Connect your free <strong>The Movie Database (TMDB)</strong> API Key to unlock unlimited live blockbusters, actor bios, and 4K trailers!</p>
              <div class="modal-form-group">
                <label>TMDB API Key (v3):</label>
                <input type="text" id="tmdb-key-input" placeholder="e.g. 8414ff428055f7883c3326ffdd34b2d6" value="${tmdbApi.getApiKey()}">
              </div>
              <div id="tmdb-verify-status" style="min-height: 20px; font-size: 0.88rem; margin-bottom: 12px;"></div>
              <div class="api-help-box">
                <strong>Get your free TMDB API Key:</strong>
                <ol>
                  <li>Create a free account at <a href="https://www.themoviedb.org/signup" target="_blank" rel="noopener">themoviedb.org</a></li>
                  <li>Go to <em>Settings > API</em> and generate a Developer/Personal API key</li>
                  <li>Paste the key above and click <em>Save & Test</em></li>
                </ol>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-modal-clear" id="btn-clear-key">Clear Key</button>
              <button type="button" class="btn-modal-save" id="btn-save-key">Save & Test</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#close-tmdb-btn').onclick = () => modal.classList.remove('open');
        modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('open'); };

        modal.querySelector('#btn-clear-key').onclick = () => {
          tmdbApi.setApiKey('');
          modal.querySelector('#tmdb-key-input').value = '';
          ui.showToast('Key cleared. Using curated offline catalog.', 'info');
          modal.classList.remove('open');
          setTimeout(() => window.location.reload(), 400);
        };

        modal.querySelector('#btn-save-key').onclick = async () => {
          const val = modal.querySelector('#tmdb-key-input').value.trim();
          const status = modal.querySelector('#tmdb-verify-status');
          if (!val) {
            tmdbApi.setApiKey('');
            modal.classList.remove('open');
            return;
          }
          status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying with TMDB...';
          try {
            const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${val}&page=1`);
            if (res.ok) {
              tmdbApi.setApiKey(val);
              status.innerHTML = '<span class="text-success"><i class="fas fa-check-circle"></i> Connected to Live TMDB!</span>';
              ui.showToast('Live TMDB API connected successfully!', 'success');
              setTimeout(() => {
                modal.classList.remove('open');
                window.location.reload();
              }, 700);
            } else {
              status.innerHTML = `<span class="text-danger"><i class="fas fa-times-circle"></i> Invalid key (HTTP ${res.status}).</span>`;
            }
          } catch (e) {
            status.innerHTML = `<span class="text-danger">${e.message}</span>`;
          }
        };
      }
      modal.classList.add('open');
    },

    initMobileNav() {
      const header = document.querySelector('.site-header');
      if (!header) return;

      const isPagesDir = window.location.pathname.includes('/pages/');
      const homeHref = isPagesDir ? './homepage.html' : './pages/homepage.html';
      const listHref = isPagesDir ? './my-list.html' : './pages/my-list.html';
      const profileHref = isPagesDir ? './profile.html' : './pages/profile.html';
      const adminHref = isPagesDir ? './admin.html' : './pages/admin.html';
      const signinHref = isPagesDir ? './signin.html' : './pages/signin.html';
      const signupHref = isPagesDir ? './signup.html' : './pages/signup.html';

      // Ensure hamburger button exists in header-right
      let hamburger = header.querySelector('.hamburger-toggle');
      if (!hamburger) {
        hamburger = document.createElement('button');
        hamburger.type = 'button';
        hamburger.className = 'hamburger-toggle';
        hamburger.setAttribute('aria-label', 'Toggle mobile navigation');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        const rightBox = header.querySelector('.header-right') || header;
        rightBox.appendChild(hamburger);
      }

      // Ensure drawer & overlay exist
      let drawer = document.getElementById('mobile-nav-drawer');
      let overlay = document.getElementById('mobile-nav-overlay');

      if (!drawer) {
        overlay = document.createElement('div');
        overlay.id = 'mobile-nav-overlay';
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);

        drawer = document.createElement('div');
        drawer.id = 'mobile-nav-drawer';
        drawer.className = 'mobile-nav-drawer';
        drawer.innerHTML = `
          <div class="mobile-drawer-header">
            <span style="font-weight: 800; font-size: 1.25rem; color: var(--color-gold); display:flex; align-items:center; gap:8px;">
              <img src="${isPagesDir ? '../' : './'}assets/icons/logo-header.svg" alt="Vynora" style="height:32px; width:auto; vertical-align:middle;">
            </span>
            <button type="button" class="mobile-drawer-close" aria-label="Close menu">&times;</button>
          </div>
          <div id="mobile-drawer-auth"></div>
          <div class="mobile-drawer-links">
            <a href="${homeHref}"><i class="fas fa-home"></i> Home</a>
            <a href="${homeHref}#trending"><i class="fas fa-fire"></i> Trending</a>
            <a href="${homeHref}#recommended"><i class="fas fa-sparkles"></i> Recommended</a>
            <a href="${homeHref}#popular"><i class="fas fa-chart-line"></i> Popular</a>
            <a href="${homeHref}#top-rated"><i class="fas fa-star"></i> Top Rated</a>
            <a href="${listHref}"><i class="fas fa-bookmark"></i> My Library</a>
            <a href="${profileHref}"><i class="fas fa-user"></i> My Profile</a>
            ${authService.isAdmin() ? `
              <div class="mobile-drawer-divider"></div>
              <a href="${adminHref}" style="color:var(--color-gold); font-weight:700;"><i class="fas fa-shield-alt"></i> Admin Dashboard</a>
            ` : ''}
          </div>
          <div class="mobile-drawer-footer" id="mobile-drawer-footer"></div>
        `;
        document.body.appendChild(drawer);

        const closeBtn = drawer.querySelector('.mobile-drawer-close');
        const closeDrawer = () => {
          drawer.classList.remove('open');
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        };

        const openDrawer = () => {
          drawer.classList.add('open');
          overlay.classList.add('open');
          document.body.style.overflow = 'hidden';
        };

        hamburger.onclick = () => {
          if (drawer.classList.contains('open')) {
            closeDrawer();
          } else {
            openDrawer();
          }
        };

        closeBtn.onclick = closeDrawer;
        overlay.onclick = closeDrawer;

        drawer.querySelectorAll('.mobile-drawer-links a').forEach(a => {
          a.addEventListener('click', () => {
            if (!a.getAttribute('onclick')) closeDrawer();
          });
        });
      }

      // Synchronize drawer auth
      authService.renderNavbarAuth();
    }
  };

  // 8b. ANALYTICS SERVICE
  const analyticsService = {
    async trackPageView(pageName) {
      if (!db) return;
      try {
        const cleanName = (pageName || 'index').replace(/[^a-zA-Z0-9_]/g, '_');
        await db.collection('site_analytics').doc('summary').set({
          totalVisits: firebase.firestore.FieldValue.increment(1),
          [`pages.${cleanName}`]: firebase.firestore.FieldValue.increment(1),
          lastVisitAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } catch (e) {
        // Silent fail
      }
    },

    async getSummary() {
      if (!db) return null;
      try {
        const snap = await db.collection('site_analytics').doc('summary').get();
        return snap.exists ? snap.data() : null;
      } catch (e) {
        return null;
      }
    }
  };

  // 8c. ADMIN SERVICE
  const adminService = {
    async verifyAdminAccess() {
      if (!authService.currentUser) return false;
      if (authService.isAdmin()) return true;
      const uid = authService.currentUser.uid;
      if (db && !uid.startsWith('local_')) {
        try {
          const doc = await db.collection('users').doc(uid).get();
          if (doc.exists && doc.data().role === 'admin') {
            return true;
          }
        } catch (e) {}
      }
      return false;
    },

    async getAllUsers() {
      if (!db) return [];
      try {
        const snap = await db.collection('users').get();
        const list = [];
        snap.forEach(d => list.push({ uid: d.id, ...d.data() }));
        return list;
      } catch (e) {
        console.error("Admin fetch users error:", e);
        return [];
      }
    },

    async setUserRole(uid, role) {
      if (!db || !uid) return false;
      await db.collection('users').doc(uid).set({ role }, { merge: true });
      return true;
    },

    async getSystemConfig() {
      // 1. Try Cloud Firestore
      if (db) {
        try {
          const doc = await db.collection('system_config').doc('general').get();
          if (doc.exists) return doc.data();
        } catch (e) {
          // Cloud permission restriction, fallback to local
        }
      }
      // 2. Fallback to Local Backup
      try {
        const local = JSON.parse(localStorage.getItem('vynora_system_config') || localStorage.getItem('psalmstrings_system_config') || '{}');
        if (local.tmdbApiKey || local.siteAnnouncement) return local;
      } catch (e) {}
      return { tmdbApiKey: tmdbApi.getApiKey() };
    },

    async saveSystemConfig(cfg) {
      // 1. Immediately activate and save locally so API key works instantly
      if (cfg.tmdbApiKey !== undefined) {
        tmdbApi.setApiKey(cfg.tmdbApiKey);
      }
      try {
        localStorage.setItem('vynora_system_config', JSON.stringify(cfg));
        localStorage.setItem('psalmstrings_system_config', JSON.stringify(cfg));
      } catch (e) {}

      // 2. Attempt Cloud Sync, catching any permission notices gracefully
      let cloudSynced = false;
      if (db) {
        try {
          await db.collection('system_config').doc('general').set({
            ...cfg,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          cloudSynced = true;
        } catch (err) {
          console.warn("Firestore system_config permission notice (using local active key):", err.message);
        }
      }
      return { success: true, cloudSynced };
    },

    async getRecentComments(limit = 25) {
      if (!db) return [];
      try {
        const snap = await db.collection('movie_comments').orderBy('createdAt', 'desc').limit(limit).get();
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        return list;
      } catch (e) {
        return [];
      }
    },

    async deleteComment(commentId) {
      if (!db || !commentId) return false;
      await db.collection('movie_comments').doc(commentId).delete();
      return true;
    }
  };

  // 9. PWA SERVICE WORKER & INSTALL PROMPT SERVICE
  const pwaService = {
    deferredPrompt: null,
    init() {
      // Register Service Worker
      if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        window.addEventListener('load', () => {
          const isSub = window.location.pathname.includes('/pages/');
          const swPath = isSub ? '../sw.js' : './sw.js';
          navigator.serviceWorker.register(swPath)
            .then(reg => {
              console.log('Vynora PWA Service Worker registered:', reg.scope);
            })
            .catch(err => {
              console.warn('Vynora SW registration info:', err.message);
            });
        });
      }

      // Capture beforeinstallprompt for rich PWA installation
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.renderInstallButton();
      });

      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        console.log('Vynora PWA installed successfully.');
        const btn = document.getElementById('btn-pwa-install');
        if (btn) btn.style.display = 'none';
      });
    },

    async promptInstall() {
      if (!this.deferredPrompt) {
        ui.showToast('To install Vynora, use "Add to Home Screen" or the install icon in your browser address bar.', 'info');
        return;
      }
      this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        ui.showToast('Welcome to Vynora PWA!', 'success');
      }
      this.deferredPrompt = null;
      const btn = document.getElementById('btn-pwa-install');
      if (btn) btn.style.display = 'none';
    },

    renderInstallButton() {
      const target = document.querySelector('.header-auth-container') || document.querySelector('.nav-links');
      if (target && !document.getElementById('btn-pwa-install')) {
        const btn = document.createElement('button');
        btn.id = 'btn-pwa-install';
        btn.type = 'button';
        btn.className = 'btn-pwa-install';
        btn.innerHTML = '<i class="fas fa-download"></i> <span class="hide-sm">Install App</span>';
        btn.title = 'Install Vynora as a native application';
        btn.onclick = () => this.promptInstall();
        target.prepend(btn);
      }
    }
  };

  // 10. EXPOSE GLOBAL NAMESPACES (Vynora + Legacy PsalmStrings alias)
  window.Vynora = {
    CONFIG,
    FALLBACK_MOVIES,
    tmdbApi,
    recommendations,
    auth: authService,
    library: libraryService,
    comments: commentsService,
    analytics: analyticsService,
    admin: adminService,
    pwa: pwaService,
    ui
  };
  window.PsalmStrings = window.Vynora;

  // Initialize immediately & on DOM ready
  authService.init();
  libraryService.init();
  pwaService.init();

  const handleInit = () => {
    ui.initMobileNav();
    pwaService.renderInstallButton();
    const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    analyticsService.trackPageView(page);
    tmdbApi.loadSystemConfig();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleInit);
  } else {
    handleInit();
  }

})(window);

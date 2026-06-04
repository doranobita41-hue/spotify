// ==========================================================================
// Song Metadata Definition
// ==========================================================================
const songsData = [
    {
        id: "song-1",
        title: "Kannazhaga (The Kiss of Love)",
        artist: "Dhanush, Shruti Haasan",
        album: "3",
        duration: 270, // 4:30
        file: "songs/Kannazhaga (The Kiss of Love).mp3",
        cover: "images/love.png",
        category: "romantic"
    },
    {
        id: "song-2",
        title: "Nee Paartha Vizhigal (The Touch of Love)",
        artist: "Vijay Yesudas, Shweta Mohan",
        album: "3",
        duration: 358, // 5:58
        file: "songs/Nee Paartha Vizhigal (The Touch of Love).mp3",
        cover: "images/love.png",
        category: "romantic"
    },
    {
        id: "song-3",
        title: "Idhazhin Oram (The Innocence of Love)",
        artist: "Ajesh, Anirudh Ravichander",
        album: "3",
        duration: 272, // 4:32
        file: "songs/Idhazhin Oram (The Innocence of Love).mp3",
        cover: "images/love.png",
        category: "romantic"
    },
    {
        id: "song-4",
        title: "Why This Kolaveri Di (The Soup of Love)",
        artist: "Dhanush",
        album: "3",
        duration: 355, // 5:55
        file: "songs/Why This Kolaveri Di (The Soup of Love).mp3",
        cover: "images/energy.png",
        category: "energy"
    },
    {
        id: "song-5",
        title: "Come on Girls (The Celebration of Love)",
        artist: "Anirudh Ravichander, Dharan Kumar",
        album: "3",
        duration: 242, // 4:02
        file: "songs/Come on Girls (The Celebration of Love).mp3",
        cover: "images/energy.png",
        category: "energy"
    },
    {
        id: "song-6",
        title: "Dheema",
        artist: "Anirudh Ravichander",
        album: "Love Insurance Kompaney",
        duration: 320, // 5:20
        file: "songs/Dheema.mp3",
        cover: "images/chill.png",
        category: "chill"
    },
    {
        id: "song-7",
        title: "Enakenna Yaarum Illaye",
        artist: "Anirudh Ravichander",
        album: "Aakko",
        duration: 360, // 6:00
        file: "songs/Enakenna Yaarum Illaye.mp3",
        cover: "images/chill.png",
        category: "chill"
    },
    {
        id: "song-8",
        title: "Mutta Kalakki",
        artist: "Anirudh Ravichander",
        album: "Independent Single",
        duration: 222, // 3:42
        file: "songs/Mutta Kalakki.mp3",
        cover: "images/energy.png",
        category: "energy"
    },
    {
        id: "song-9",
        title: "Pavazha Malli",
        artist: "Sean Roldan, Satyaprakash",
        album: "Lover",
        duration: 354, // 5:54
        file: "songs/Pavazha Malli.mp3",
        cover: "images/folk.png",
        category: "folk"
    },
    {
        id: "song-10",
        title: "Po Nee Po (The Pain of Love)",
        artist: "Mohit Chauhan, Anirudh Ravichander",
        album: "3",
        duration: 331, // 5:31
        file: "songs/Po Nee Po (The Pain of Love).mp3",
        cover: "images/folk.png",
        category: "folk"
    },
    {
        id: "song-11",
        title: "Singari",
        artist: "Anirudh Ravichander",
        album: "Independent Single",
        duration: 285, // 4:45
        file: "songs/Singari.mp3",
        cover: "images/folk.png",
        category: "folk"
    },
    {
        id: "song-12",
        title: "The Rhythm of Love Theme (Theme)",
        artist: "Anirudh Ravichander",
        album: "3",
        duration: 100, // 1:40
        file: "songs/The Rhythm of Love Theme (Theme).mp3",
        cover: "images/chill.png",
        category: "chill"
    }
];

// ==========================================================================
// Application State
// ==========================================================================
let state = {
    currentSong: null,
    currentPlaylist: {
        id: "all-songs",
        title: "All Songs",
        description: "All the local tracks available in your library.",
        cover: "images/chill.png",
        songs: [...songsData]
    },
    queue: [...songsData],
    history: [], // For back navigation between tabs/playlists
    viewHistory: ["home"], // Navigation stack for back/forward buttons
    viewHistoryIndex: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false, // 0 = no repeat, 1 = repeat playlist, 2 = repeat song
    volume: 70,
    likedSongs: JSON.parse(localStorage.getItem("likedSongs")) || [],
    customPlaylists: JSON.parse(localStorage.getItem("customPlaylists")) || []
};

// ==========================================================================
// Audio Element Cache
// ==========================================================================
const audio = document.getElementById("audio-engine");

// ==========================================================================
// SVGs Cache for dynamic injection
// ==========================================================================
const playSVG = `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>`;
const pauseSVG = `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/></svg>`;

// ==========================================================================
// Helper Functions
// ==========================================================================
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateSliderBackground(slider, value, max = 100) {
    const percent = (value / max) * 100;
    slider.style.background = `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percent}%, rgba(255, 255, 255, 0.1) ${percent}%, rgba(255, 255, 255, 0.1) 100%)`;
}

// ==========================================================================
// Core UI Renderers
// ==========================================================================

// Render Sidebar Playlists
function renderSidebarPlaylists() {
    const container = document.getElementById("playlists-list-container");
    container.innerHTML = "";

    // Default Playlists
    const defaults = [
        { id: "all-songs", title: "All Songs" },
        { id: "liked-songs", title: "Liked Songs" },
        { id: "romantic", title: "Romantic Collection" },
        { id: "energy", title: "Energetic Beats" }
    ];

    defaults.forEach(pl => {
        const div = document.createElement("div");
        div.className = `playlist-item ${state.currentPlaylist.id === pl.id ? 'active' : ''}`;
        div.innerText = pl.title;
        div.addEventListener("click", () => loadPlaylist(pl.id));
        container.appendChild(div);
    });

    // Custom Playlists
    state.customPlaylists.forEach(pl => {
        const div = document.createElement("div");
        div.className = `playlist-item ${state.currentPlaylist.id === pl.id ? 'active' : ''}`;
        div.innerText = pl.title;
        div.addEventListener("click", () => loadPlaylist(pl.id));
        container.appendChild(div);
    });
}

// Render Home View Content
function renderHomeView() {
    // 1. Greeting
    const hour = new Date().getHours();
    let greeting = "Good evening";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    document.getElementById("greeting-title").innerText = greeting;

    // 2. Quick Grid (top 6 songs)
    const quickGrid = document.getElementById("quick-play-grid");
    quickGrid.innerHTML = "";
    songsData.slice(0, 6).forEach(song => {
        const card = document.createElement("div");
        card.className = "quick-card";
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="quick-card-img">
            <span class="quick-card-title">${song.title}</span>
            <button class="quick-play-btn" title="Play">
                ${state.currentSong?.id === song.id && state.isPlaying ? pauseSVG : playSVG}
            </button>
        `;
        
        // Handle click card to open details / play
        card.addEventListener("click", (e) => {
            if (e.target.closest(".quick-play-btn")) {
                e.stopPropagation();
                togglePlaySong(song, songsData);
            } else {
                loadPlaylist("all-songs");
            }
        });
        quickGrid.appendChild(card);
    });

    // 3. Featured Albums Grid
    const featuredGrid = document.getElementById("featured-albums-grid");
    featuredGrid.innerHTML = "";
    
    const playlists = [
        { id: "romantic", title: "Romantic Collection", desc: "Love and intimacy songs by Anirudh", cover: "images/love.png" },
        { id: "energy", title: "Energetic Beats", desc: "Fast-paced high energy hits", cover: "images/energy.png" },
        { id: "chill", title: "Chill Vibes", desc: "Relaxing atmospheric melodies", cover: "images/chill.png" }
    ];

    playlists.forEach(pl => {
        const card = document.createElement("div");
        card.className = "song-card";
        card.innerHTML = `
            <div class="song-card-img-wrapper">
                <img src="${pl.cover}" alt="${pl.title}" class="song-card-img">
                <button class="song-card-play-btn" title="Play">
                    ${playSVG}
                </button>
            </div>
            <div class="song-card-title">${pl.title}</div>
            <div class="song-card-artist">${pl.desc}</div>
        `;
        card.addEventListener("click", (e) => {
            if (e.target.closest(".song-card-play-btn")) {
                e.stopPropagation();
                const plistSongs = getPlaylistSongs(pl.id);
                if (plistSongs.length > 0) togglePlaySong(plistSongs[0], plistSongs);
            } else {
                loadPlaylist(pl.id);
            }
        });
        featuredGrid.appendChild(card);
    });

    // 4. All Songs Grid
    const allGrid = document.getElementById("all-songs-grid");
    allGrid.innerHTML = "";
    songsData.forEach(song => {
        const card = document.createElement("div");
        card.className = "song-card";
        card.innerHTML = `
            <div class="song-card-img-wrapper">
                <img src="${song.cover}" alt="${song.title}" class="song-card-img">
                <button class="song-card-play-btn" title="Play">
                    ${state.currentSong?.id === song.id && state.isPlaying ? pauseSVG : playSVG}
                </button>
            </div>
            <div class="song-card-title">${song.title}</div>
            <div class="song-card-artist">${song.artist}</div>
        `;
        card.addEventListener("click", (e) => {
            if (e.target.closest(".song-card-play-btn")) {
                e.stopPropagation();
                togglePlaySong(song, songsData);
            } else {
                loadPlaylist("all-songs");
            }
        });
        allGrid.appendChild(card);
    });
}

// Get songs based on playlist identifier
function getPlaylistSongs(id) {
    if (id === "all-songs") return [...songsData];
    if (id === "liked-songs") return songsData.filter(s => state.likedSongs.includes(s.id));
    if (id === "romantic" || id === "energy" || id === "chill" || id === "folk") {
        return songsData.filter(s => s.category === id);
    }
    // Custom playlist lookup
    const custom = state.customPlaylists.find(p => p.id === id);
    return custom ? songsData.filter(s => custom.songs.includes(s.id)) : [];
}

// Get playlist metadata
function getPlaylistMeta(id) {
    if (id === "all-songs") return { title: "All Songs", desc: "All the local tracks available in your library.", cover: "images/chill.png", type: "PLAYLIST" };
    if (id === "liked-songs") return { title: "Liked Songs", desc: "Your personal collection of favorite tracks.", cover: "images/love.png", type: "PLAYLIST" };
    if (id === "romantic") return { title: "Romantic Collection", desc: "Smooth acoustic love songs and themes.", cover: "images/love.png", type: "ALBUM" };
    if (id === "energy") return { title: "Energetic Beats", desc: "High octane beats to keep you active.", cover: "images/energy.png", type: "ALBUM" };
    if (id === "chill") return { title: "Chill Vibes", desc: "Atmospheric, ambient tunes and themes.", cover: "images/chill.png", type: "ALBUM" };
    if (id === "folk") return { title: "Folk & Acoustic", desc: "Rooted acoustic melodies and traditional beats.", cover: "images/folk.png", type: "ALBUM" };
    
    const custom = state.customPlaylists.find(p => p.id === id);
    return custom ? { title: custom.title, desc: "Custom playlist created by you.", cover: "images/chill.png", type: "PLAYLIST" } : null;
}

// Navigation between views
function navigateTo(viewId) {
    // Hide all views
    document.getElementById("view-home").classList.add("hidden");
    document.getElementById("view-search").classList.add("hidden");
    document.getElementById("view-details").classList.add("hidden");
    
    // Hide or show search input wrapper
    const searchWrapper = document.getElementById("search-box-wrapper");
    if (viewId === "search") {
        searchWrapper.classList.remove("hidden");
    } else {
        searchWrapper.classList.add("hidden");
    }

    // Show selected view
    document.getElementById(`view-${viewId}`).classList.remove("hidden");

    // Manage nav links active state
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    if (viewId === "home") document.getElementById("nav-home").classList.add("active");
    if (viewId === "search") document.getElementById("nav-search").classList.add("active");
    if (viewId === "details" && state.currentPlaylist.id === "all-songs") document.getElementById("nav-library").classList.add("active");

    // Add to navigation history if it's new
    if (state.viewHistory[state.viewHistoryIndex] !== viewId) {
        state.viewHistory = state.viewHistory.slice(0, state.viewHistoryIndex + 1);
        state.viewHistory.push(viewId);
        state.viewHistoryIndex = state.viewHistory.length - 1;
    }
}

// Load a playlist into detail view
function loadPlaylist(id) {
    const meta = getPlaylistMeta(id);
    if (!meta) return;

    const playlistSongs = getPlaylistSongs(id);

    state.currentPlaylist = {
        id: id,
        title: meta.title,
        description: meta.desc,
        cover: meta.cover,
        songs: playlistSongs
    };

    // Update Detail UI
    document.getElementById("detail-playlist-title").innerText = meta.title;
    document.getElementById("detail-playlist-desc").innerText = meta.desc;
    document.getElementById("detail-playlist-type").innerText = meta.type;
    document.getElementById("detail-cover-img").src = meta.cover;
    document.getElementById("detail-song-count").innerText = `${playlistSongs.length} song${playlistSongs.length !== 1 ? 's' : ''}`;

    // Sync Like Status of Playlist (for Liked Songs)
    const likeBtn = document.getElementById("btn-playlist-like");
    if (id === "liked-songs") {
        likeBtn.classList.add("liked");
    } else {
        likeBtn.classList.remove("liked");
    }

    renderTracklist();
    renderSidebarPlaylists();
    navigateTo("details");
}

// Render the list of tracks in Detail View
function renderTracklist() {
    const container = document.getElementById("tracklist-rows-container");
    container.innerHTML = "";

    if (state.currentPlaylist.songs.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                No songs in this playlist. Start adding some!
            </div>
        `;
        return;
    }

    state.currentPlaylist.songs.forEach((song, index) => {
        const isCurrent = state.currentSong?.id === song.id;
        const isLiked = state.likedSongs.includes(song.id);

        const row = document.createElement("div");
        row.className = `track-row ${isCurrent ? 'active' : ''} ${isCurrent && !state.isPlaying ? 'paused' : ''}`;
        
        let playStateIcon = playSVG;
        if (isCurrent && state.isPlaying) {
            playStateIcon = pauseSVG;
        }

        row.innerHTML = `
            <div class="track-row-num">
                <span class="track-row-num-text">${index + 1}</span>
                <span class="track-row-play-btn">${playStateIcon}</span>
            </div>
            <div class="track-row-title-container">
                <img src="${song.cover}" class="track-row-cover" alt="Cover">
                <div class="track-row-details">
                    <span class="track-row-title">${song.title}</span>
                    <span class="track-row-artist">${song.artist}</span>
                </div>
            </div>
            <div class="track-row-album">${song.album}</div>
            <div class="track-row-duration">
                <button class="track-row-like-btn ${isLiked ? 'liked' : ''}" title="${isLiked ? 'Remove from Library' : 'Save to Library'}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                <span>${formatTime(song.duration)}</span>
                ${isCurrent && state.isPlaying ? `
                <div class="waveform-anim">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>` : ''}
            </div>
        `;

        // Click row: Play song
        row.addEventListener("click", (e) => {
            if (e.target.closest(".track-row-like-btn")) {
                e.stopPropagation();
                toggleLikeSong(song.id);
            } else {
                togglePlaySong(song, state.currentPlaylist.songs);
            }
        });

        container.appendChild(row);
    });
}

// Render Search Results
function renderSearchResults(query) {
    const resultsContainer = document.getElementById("search-results-list");
    const emptyState = document.querySelector(".search-empty-state");

    if (!query || query.trim() === "") {
        resultsContainer.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }

    const filtered = songsData.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        song.album.toLowerCase().includes(query.toLowerCase())
    );

    emptyState.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    resultsContainer.innerHTML = "";

    if (filtered.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                No songs, artists, or albums found matching "${query}"
            </div>
        `;
        return;
    }

    // Header
    const header = document.createElement("div");
    header.className = "tracklist-header-row";
    header.innerHTML = `
        <div class="col-num">#</div>
        <div class="col-title">Title</div>
        <div class="col-album">Album</div>
        <div class="col-duration">Duration</div>
    `;
    resultsContainer.appendChild(header);

    // List rows
    filtered.forEach((song, index) => {
        const isCurrent = state.currentSong?.id === song.id;
        const isLiked = state.likedSongs.includes(song.id);
        const row = document.createElement("div");
        row.className = `track-row ${isCurrent ? 'active' : ''}`;
        
        let playStateIcon = playSVG;
        if (isCurrent && state.isPlaying) {
            playStateIcon = pauseSVG;
        }

        row.innerHTML = `
            <div class="track-row-num">
                <span class="track-row-num-text">${index + 1}</span>
                <span class="track-row-play-btn">${playStateIcon}</span>
            </div>
            <div class="track-row-title-container">
                <img src="${song.cover}" class="track-row-cover" alt="Cover">
                <div class="track-row-details">
                    <span class="track-row-title">${song.title}</span>
                    <span class="track-row-artist">${song.artist}</span>
                </div>
            </div>
            <div class="track-row-album">${song.album}</div>
            <div class="track-row-duration">
                <button class="track-row-like-btn ${isLiked ? 'liked' : ''}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                <span>${formatTime(song.duration)}</span>
            </div>
        `;

        row.addEventListener("click", (e) => {
            if (e.target.closest(".track-row-like-btn")) {
                e.stopPropagation();
                toggleLikeSong(song.id);
            } else {
                togglePlaySong(song, filtered);
            }
        });

        resultsContainer.appendChild(row);
    });
}

// Render Upcoming Queue in Right Panel
function renderRightPanelQueue() {
    const queueList = document.getElementById("queue-list-container");
    queueList.innerHTML = "";

    if (!state.currentSong) {
        queueList.innerHTML = `<div style="font-size: 13px; color: var(--text-muted);">Queue is empty.</div>`;
        return;
    }

    const currentIndex = state.queue.findIndex(s => s.id === state.currentSong.id);
    let upcoming = [];
    
    if (currentIndex !== -1) {
        // Show next 4 songs
        for (let i = 1; i <= 4; i++) {
            const nextIdx = (currentIndex + i) % state.queue.length;
            if (nextIdx !== currentIndex) {
                upcoming.push(state.queue[nextIdx]);
            }
        }
    }

    upcoming.forEach(song => {
        const item = document.createElement("div");
        item.className = "queue-item";
        item.innerHTML = `
            <img src="${song.cover}" class="queue-item-img" alt="Cover">
            <div class="queue-item-text">
                <div class="queue-item-title">${song.title}</div>
                <div class="queue-item-artist">${song.artist}</div>
            </div>
        `;
        item.addEventListener("click", () => {
            togglePlaySong(song, state.queue);
        });
        queueList.appendChild(item);
    });
}

// ==========================================================================
// Playback Control Logic
// ==========================================================================

// Load song without playing it (for initialization)
function loadSong(song) {
    state.currentSong = song;
    audio.src = song.file;
    audio.load();

    // Update Bottom Player UI
    document.getElementById("player-cover").src = song.cover;
    document.getElementById("player-title").innerText = song.title;
    document.getElementById("player-artist").innerText = song.artist;
    document.getElementById("time-duration").innerText = formatTime(song.duration);
    document.getElementById("time-current").innerText = "0:00";
    
    const seekSlider = document.getElementById("seek-slider");
    seekSlider.value = 0;
    seekSlider.max = song.duration;
    updateSliderBackground(seekSlider, 0, song.duration);

    // Sync Like Status on Player
    const playerLike = document.getElementById("player-like-btn");
    if (state.likedSongs.includes(song.id)) {
        playerLike.classList.add("liked");
    } else {
        playerLike.classList.remove("liked");
    }

    // Sync Right Side Panel
    document.getElementById("right-panel-art").src = song.cover;
    document.getElementById("right-panel-title").innerText = song.title;
    document.getElementById("right-panel-artist").innerText = song.artist;
    document.getElementById("right-panel-album").innerText = song.album;

    // Refresh dynamic active states on views
    if (!document.getElementById("view-details").classList.contains("hidden")) {
        renderTracklist();
    }
    if (!document.getElementById("view-home").classList.contains("hidden")) {
        renderHomeView();
    }
    if (!document.getElementById("view-search").classList.contains("hidden")) {
        const query = document.getElementById("search-input").value;
        renderSearchResults(query);
    }
    renderRightPanelQueue();
}

// Play / Pause toggle
function togglePlay() {
    if (!state.currentSong && songsData.length > 0) {
        loadSong(songsData[0]);
    }

    if (state.isPlaying) {
        audio.pause();
        state.isPlaying = false;
        document.getElementById("play-pause-icon").innerHTML = playSVG;
    } else {
        audio.play().then(() => {
            state.isPlaying = true;
            document.getElementById("play-pause-icon").innerHTML = pauseSVG;
        }).catch(err => {
            console.error("Playback failed:", err);
        });
    }

    // Sync UI elements
    if (!document.getElementById("view-details").classList.contains("hidden")) {
        renderTracklist();
    }
    if (!document.getElementById("view-home").classList.contains("hidden")) {
        renderHomeView();
    }
}

// Play a specific song and update current queue context
function togglePlaySong(song, playlistContext) {
    const isSameSong = state.currentSong?.id === song.id;

    if (playlistContext && JSON.stringify(state.queue) !== JSON.stringify(playlistContext)) {
        state.queue = [...playlistContext];
    }

    if (isSameSong) {
        togglePlay();
    } else {
        loadSong(song);
        state.isPlaying = false; // reset state before play trigger
        togglePlay();
    }
}

// Skip forward
function nextSong() {
    if (state.queue.length === 0) return;

    let nextIdx = 0;
    if (state.isShuffle) {
        nextIdx = Math.floor(Math.random() * state.queue.length);
    } else if (state.currentSong) {
        const currentIdx = state.queue.findIndex(s => s.id === state.currentSong.id);
        nextIdx = (currentIdx + 1) % state.queue.length;
    }

    togglePlaySong(state.queue[nextIdx]);
}

// Skip backward
function prevSong() {
    if (state.queue.length === 0) return;

    let prevIdx = 0;
    
    // If song is played > 3 seconds, restart it instead of going back
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    if (state.isShuffle) {
        prevIdx = Math.floor(Math.random() * state.queue.length);
    } else if (state.currentSong) {
        const currentIdx = state.queue.findIndex(s => s.id === state.currentSong.id);
        prevIdx = currentIdx - 1;
        if (prevIdx < 0) prevIdx = state.queue.length - 1;
    }

    togglePlaySong(state.queue[prevIdx]);
}

// Toggle Shuffle state
function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    const btn = document.getElementById("btn-shuffle");
    if (state.isShuffle) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }
    renderRightPanelQueue();
}

// Toggle Repeat state
function toggleRepeat() {
    state.isRepeat = !state.isRepeat;
    const btn = document.getElementById("btn-repeat");
    if (state.isRepeat) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }
}

// Volume operations
function setVolume(val) {
    state.volume = val;
    audio.volume = val / 100;
    document.getElementById("volume-slider").value = val;
    updateSliderBackground(document.getElementById("volume-slider"), val);

    // Update volume icon based on level
    const icon = document.getElementById("volume-icon");
    if (val == 0) {
        icon.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>`;
    } else if (val < 50) {
        icon.innerHTML = `<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" fill="currentColor"/>`;
    } else {
        icon.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>`;
    }
}

// Liked/Favorite toggle
function toggleLikeSong(songId) {
    const index = state.likedSongs.indexOf(songId);
    if (index === -1) {
        state.likedSongs.push(songId);
    } else {
        state.likedSongs.splice(index, 1);
    }
    localStorage.setItem("likedSongs", JSON.stringify(state.likedSongs));

    // Update active UI (detail lists or home)
    if (state.currentPlaylist.id === "liked-songs") {
        // Reload Liked Songs view dynamically
        loadPlaylist("liked-songs");
    } else {
        renderTracklist();
    }

    if (state.currentSong?.id === songId) {
        const playerLike = document.getElementById("player-like-btn");
        if (state.likedSongs.includes(songId)) {
            playerLike.classList.add("liked");
        } else {
            playerLike.classList.remove("liked");
        }
    }

    renderHomeView();
}

// User-created playlists
function createCustomPlaylist() {
    const name = prompt("Enter playlist name:");
    if (!name || name.trim() === "") return;

    const id = `custom-playlist-${Date.now()}`;
    const newPl = {
        id: id,
        title: name.trim(),
        songs: []
    };

    state.customPlaylists.push(newPl);
    localStorage.setItem("customPlaylists", JSON.stringify(state.customPlaylists));
    renderSidebarPlaylists();
    loadPlaylist(id);
}

// ==========================================================================
// Event Listeners Configuration
// ==========================================================================
function setupEventListeners() {
    // 1. Audio Engine Events
    audio.addEventListener("timeupdate", () => {
        const currentLabel = document.getElementById("time-current");
        const seekSlider = document.getElementById("seek-slider");
        
        currentLabel.innerText = formatTime(audio.currentTime);
        seekSlider.value = audio.currentTime;
        updateSliderBackground(seekSlider, audio.currentTime, audio.duration || 100);
    });

    audio.addEventListener("loadedmetadata", () => {
        document.getElementById("time-duration").innerText = formatTime(audio.duration);
        document.getElementById("seek-slider").max = audio.duration;
    });

    audio.addEventListener("ended", () => {
        if (state.isRepeat) {
            // Repeat track
            audio.currentTime = 0;
            audio.play();
        } else {
            // Play next
            nextSong();
        }
    });

    // 2. Playbar Slider Seeking
    const seekSlider = document.getElementById("seek-slider");
    seekSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        updateSliderBackground(seekSlider, val, audio.duration || 100);
        document.getElementById("time-current").innerText = formatTime(val);
    });

    seekSlider.addEventListener("change", (e) => {
        audio.currentTime = parseFloat(e.target.value);
    });

    // 3. Playbar Volume Seeking
    const volumeSlider = document.getElementById("volume-slider");
    volumeSlider.addEventListener("input", (e) => {
        setVolume(parseInt(e.target.value));
    });

    // 4. Playbar Controls Clicks
    document.getElementById("btn-play-pause").addEventListener("click", togglePlay);
    document.getElementById("btn-next").addEventListener("click", nextSong);
    document.getElementById("btn-prev").addEventListener("click", prevSong);
    document.getElementById("btn-shuffle").addEventListener("click", toggleShuffle);
    document.getElementById("btn-repeat").addEventListener("click", toggleRepeat);
    document.getElementById("player-like-btn").addEventListener("click", () => {
        if (state.currentSong) toggleLikeSong(state.currentSong.id);
    });

    // Mute/Unmute
    let preMuteVolume = 70;
    document.getElementById("btn-mute").addEventListener("click", () => {
        if (state.volume > 0) {
            preMuteVolume = state.volume;
            setVolume(0);
        } else {
            setVolume(preMuteVolume);
        }
    });

    // 5. Sidebar Navigation Clicks
    document.getElementById("nav-home").addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("home");
        renderHomeView();
    });

    document.getElementById("nav-search").addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("search");
        document.getElementById("search-input").focus();
    });

    document.getElementById("nav-library").addEventListener("click", (e) => {
        e.preventDefault();
        loadPlaylist("all-songs");
    });

    document.getElementById("btn-create-playlist").addEventListener("click", createCustomPlaylist);

    // 6. Search Inputs
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
        renderSearchResults(e.target.value);
    });

    // Click genres to trigger pre-filtered search
    document.querySelectorAll(".genre-card").forEach(card => {
        card.addEventListener("click", () => {
            const keyword = card.querySelector("span").innerText;
            if (keyword.includes("Tamil")) searchInput.value = "Anirudh";
            else if (keyword.includes("Romantic")) searchInput.value = "Love";
            else if (keyword.includes("Energetic")) searchInput.value = "Girls";
            else if (keyword.includes("Acoustic")) searchInput.value = "Theme";
            renderSearchResults(searchInput.value);
        });
    });

    // 7. Playlist Actions
    document.getElementById("btn-play-all").addEventListener("click", () => {
        if (state.currentPlaylist.songs.length > 0) {
            togglePlaySong(state.currentPlaylist.songs[0], state.currentPlaylist.songs);
        }
    });

    document.getElementById("btn-playlist-like").addEventListener("click", () => {
        if (state.currentPlaylist.id === "liked-songs") return; // Already liked songs playlist
        
        // Toggle liking all songs in the current playlist
        const allSongsInPl = state.currentPlaylist.songs;
        if (allSongsInPl.length === 0) return;
        
        const allLiked = allSongsInPl.every(s => state.likedSongs.includes(s.id));
        allSongsInPl.forEach(s => {
            const idx = state.likedSongs.indexOf(s.id);
            if (allLiked) {
                // remove all
                if (idx !== -1) state.likedSongs.splice(idx, 1);
            } else {
                // add all
                if (idx === -1) state.likedSongs.push(s.id);
            }
        });
        localStorage.setItem("likedSongs", JSON.stringify(state.likedSongs));
        renderTracklist();
        renderHomeView();
    });

    // 8. Panels toggling
    const rightPanel = document.getElementById("right-info-panel");
    
    document.getElementById("btn-queue-toggle").addEventListener("click", () => {
        rightPanel.classList.toggle("hidden");
        renderRightPanelQueue();
    });

    document.getElementById("btn-close-right-panel").addEventListener("click", () => {
        rightPanel.classList.add("hidden");
    });

    // 9. Back / Forward Navigation arrows
    document.getElementById("nav-back").addEventListener("click", () => {
        if (state.viewHistoryIndex > 0) {
            state.viewHistoryIndex--;
            const prevView = state.viewHistory[state.viewHistoryIndex];
            navigateTo(prevView);
        }
    });

    document.getElementById("nav-forward").addEventListener("click", () => {
        if (state.viewHistoryIndex < state.viewHistory.length - 1) {
            state.viewHistoryIndex++;
            const nextView = state.viewHistory[state.viewHistoryIndex];
            navigateTo(nextView);
        }
    });
}

// ==========================================================================
// Initialization
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
    // Set initial volume
    setVolume(state.volume);

    // Initial state renders
    renderSidebarPlaylists();
    renderHomeView();
    setupEventListeners();

    // Load first song by default
    if (songsData.length > 0) {
        loadSong(songsData[0]);
    }
});

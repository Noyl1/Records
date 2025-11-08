
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
const themeToggle = document.getElementById('themeToggle');
const themeIndicator = document.querySelector('.theme-indicator');

const songGrid = document.getElementById('songGrid');
const songCards = document.querySelectorAll('.song-card');

const audio = document.getElementById('audio');
const playPause = document.getElementById('playPause');
const likeNow = document.getElementById('likeNow');
const addNow = document.getElementById('addNow');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerArt = document.getElementById('playerArt');
const lyricsContent = document.getElementById('lyricsContent');
const progress = document.getElementById('progress');
const time = document.getElementById('time');

const searchInput = document.getElementById('searchInput');
const likedList = document.getElementById('likedList');
const libraryList = document.getElementById('libraryList');

let themes = ['yt-theme','spotify-theme','apple-theme','purple-theme'];
let themeIdx = 0;

// Sidebar collapse/expand
menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// Navigation: switch pages
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const pageId = btn.dataset.page;
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
  });
});

// Theme toggle (cycles 3)
themeToggle.addEventListener('click', () => {
  document.body.classList.remove(themes[themeIdx]);
  themeIdx = (themeIdx + 1) % themes.length;
  document.body.classList.add(themes[themeIdx]);
});

// Play a song when clicking a card play button
songCards.forEach(card => {
  const playBtn = card.querySelector('.play-small');
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const src = card.dataset.src;
    const title = card.dataset.title;
    const artist = card.dataset.artist;
    const lyrics = card.dataset.lyrics || 'No lyrics available.';
    if (!src) return alert('Missing audio file: ' + src);
    audio.src = src;
    playerTitle.textContent = title;
    playerArtist.textContent = artist;
    playerArt.src = card.querySelector('img').src;
    lyricsContent.textContent = lyrics;
    audio.play().then(() => {
      playPause.textContent = '⏸';
    }).catch(() => {
      alert('Playback blocked by browser. Click play at bottom.');
    });
  });
});

// Clicking the whole card also plays
songCards.forEach(card => {
  card.addEventListener('click', () => {
    card.querySelector('.play-small').click();
  });
});

// Bottom play/pause
playPause.addEventListener('click', () => {
  if (!audio.src) return alert('Select a song first.');
  if (audio.paused) {
    audio.play();
    playPause.textContent = '⏸';
  } else {
    audio.pause();
    playPause.textContent = '▶';
  }
});

// Like / Add
likeNow.addEventListener('click', () => {
  if (!playerTitle.textContent || playerTitle.textContent === 'No song playing') return;
  const li = document.createElement('li');
  li.textContent = `${playerTitle.textContent} — ${playerArtist.textContent}`;
  likedList.appendChild(li);
});

addNow.addEventListener('click', () => {
  if (!playerTitle.textContent || playerTitle.textContent === 'No song playing') return;
  const li = document.createElement('li');
  li.textContent = `${playerTitle.textContent} — ${playerArtist.textContent}`;
  libraryList.appendChild(li);
});

// Progress/time update
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progress.value = pct;
  const m = Math.floor(audio.currentTime / 60);
  const s = String(Math.floor(audio.currentTime % 60)).padStart(2,'0');
  time.textContent = `${m}:${s}`;
});
progress.addEventListener('input', () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// Search filter
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  songCards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const artist = card.dataset.artist.toLowerCase();
    card.style.display = (title.includes(q) || artist.includes(q) || q === '') ? 'flex' : 'none';
  });
});

// ===== LOGIN MODAL =====
const profileBtn = document.getElementById('profileBtn');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');

profileBtn.addEventListener('click', () => {
  loginModal.classList.add('active');
});

closeLogin.addEventListener('click', () => {
  loginModal.classList.remove('active');
});

loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.classList.remove('active');
});

//Recently Played function//
window.addEventListener("DOMContentLoaded", function() {
  var recentlyPlayed = document.getElementById("recentlyPlayed");
  var recentList = [];

  // use existing songCards from the top of your file//
  songCards.forEach(function(card) {
    card.addEventListener("click", function() {
      var title = card.getAttribute("data-title");
      var artist = card.getAttribute("data-artist");
      var image = card.querySelector("img").src;

      // Remove duplicates//
      recentList = recentList.filter(function(song) {
        return song.title !== title;
      });

      // Add to the top//
      recentList.unshift({ title: title, artist: artist, image: image });

      // Limit to 5//
      if (recentList.length > 5) {
        recentList.pop();
      }

      // Update HTML//
      recentlyPlayed.innerHTML = "";
      recentList.forEach(function(song) {
        var div = document.createElement("div");
        div.className = "recent-item";
        div.innerHTML = `
          <img src="${song.image}" width="50" height="50" style="border-radius:6px;margin-right:10px;">
          <strong>${song.title}</strong> — <span>${song.artist}</span>
        `;
        recentlyPlayed.appendChild(div);
      });
    });
  });
});

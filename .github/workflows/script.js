// ===== Clock =====
function tickClock(){
  const el = document.getElementById('clockVal');
  if(!el) return;
  const d = new Date();
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  el.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(tickClock, 1000);
tickClock();

// ===== Fake ping flicker (cosmetic only) =====
function tickPing(){
  const el = document.getElementById('pingVal');
  if(!el) return;
  const base = 18 + Math.floor(Math.random()*14);
  el.textContent = `${base}ms`;
}
setInterval(tickPing, 2200);

// ===== Audio player =====
const tracks = [
  { name: 'SMOKEDOPE2016 — KHALIFA', src: 'assets/audio/khalifa-smokedope2016.mp3' },
  { name: 'SMOKEDOPE2016 — KUSH',    src: 'assets/audio/kush-smokedope2016.mp3' },
  { name: 'NOKIA ANGEL x GHOSTFACEKUSH x SMOKEDOPE2016 — CHF', src: 'assets/audio/chf-nokia-angel.mp3' },
];

let current = 0;
let isPlaying = false;

const audioEl    = document.getElementById('audioEl');
const audioSrc   = document.getElementById('audioSrc');
const playBtn    = document.getElementById('playBtn');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');
const trackName  = document.getElementById('trackName');
const trackIndex = document.getElementById('trackIndex');
const scrub      = document.getElementById('scrub');
const timeCur    = document.getElementById('timeCur');
const timeDur    = document.getElementById('timeDur');
const volume     = document.getElementById('volume');
const volVal     = document.getElementById('volVal');
const playerEl   = document.getElementById('player');

function fmt(t){
  if(!isFinite(t)) return '00:00';
  const m = Math.floor(t/60);
  const s = Math.floor(t%60);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function loadTrack(i, autoplay){
  current = (i + tracks.length) % tracks.length;
  const t = tracks[current];
  audioSrc.src = t.src;
  audioEl.load();
  trackName.textContent = t.name;
  trackIndex.textContent = `${String(current+1).padStart(2,'0')}/${String(tracks.length).padStart(2,'0')}`;
  if(autoplay){
    audioEl.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));
  }
}

function setPlaying(state){
  isPlaying = state;
  playBtn.textContent = isPlaying ? '❚❚' : '►';
  playerEl.classList.toggle('is-paused', !isPlaying);
}

playBtn.addEventListener('click', ()=>{
  if(audioEl.paused){
    audioEl.play().then(()=>setPlaying(true)).catch(()=>{});
  } else {
    audioEl.pause();
    setPlaying(false);
  }
});

prevBtn.addEventListener('click', ()=> loadTrack(current-1, true));
nextBtn.addEventListener('click', ()=> loadTrack(current+1, true));

audioEl.addEventListener('ended', ()=> loadTrack(current+1, true));

audioEl.addEventListener('loadedmetadata', ()=>{
  timeDur.textContent = fmt(audioEl.duration);
  scrub.max = audioEl.duration || 0;
});

audioEl.addEventListener('timeupdate', ()=>{
  timeCur.textContent = fmt(audioEl.currentTime);
  if(!scrub.matches(':active')){
    scrub.value = audioEl.currentTime;
  }
});

scrub.addEventListener('input', ()=>{
  audioEl.currentTime = Number(scrub.value);
});

volume.addEventListener('input', ()=>{
  audioEl.volume = Number(volume.value)/100;
  volVal.textContent = volume.value;
});

// init
audioEl.volume = Number(volume.value)/100;
loadTrack(0, false);
setPlaying(false);

<template>
  <div class="player-container">
    <!-- REPRODUCTOR CARD -->
    <div class="player-card">
      <div class="album-art-area">
        <div class="art-disc" :class="{ 'disc-spinning': isPlaying }">
          <div class="disc-vinyl">
            <MusicIcon class="disc-center-icon" />
          </div>
        </div>
        
        <!-- ONDAS DE SONIDO REACTIVAS -->
        <div class="wave-visualizer" :class="{ 'wave-active': isPlaying }">
          <div v-for="i in 12" :key="i" class="wave-bar" :style="barStyle(i)"></div>
        </div>
      </div>

      <div class="track-info">
        <h3 class="track-title">{{ currentTrack.title }}</h3>
        <span class="track-artist">{{ currentTrack.artist }}</span>
      </div>

      <!-- BARRA DE TIEMPO / PROGRESO -->
      <div class="progress-section">
        <span class="time-lbl">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar-bg" @click="seek">
          <div class="progress-bar-fill" :style="{ width: `${progressPct}%` }"></div>
        </div>
        <span class="time-lbl">{{ formatTime(currentTrack.duration) }}</span>
      </div>

      <!-- CONTROLES MULTIMEDIA -->
      <div class="media-controls">
        <button type="button" class="ctrl-btn-side" @click="prevTrack">
          <SkipBackIcon class="ctrl-icon-svg" />
        </button>

        <button type="button" class="ctrl-btn-play" @click="togglePlay">
          <component :is="isPlaying ? PauseIcon : PlayIcon" class="ctrl-icon-play-svg" />
        </button>

        <button type="button" class="ctrl-btn-side" @click="nextTrack">
          <SkipForwardIcon class="ctrl-icon-svg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
  Music as MusicIcon
} from 'lucide-vue-next';

interface Track {
  title: string;
  artist: string;
  duration: number; // en segundos
}

const tracks: Track[] = [
  { title: 'Cyberpunk Cityscape', artist: 'Neon Phantom', duration: 184 },
  { title: 'Synthwave Odyssey', artist: 'antorlok Beats', duration: 215 },
  { title: 'Retrofuturism', artist: 'Vector Glitch', duration: 162 }
];

const trackIndex = ref(0);
const isPlaying = ref(false);
const currentTime = ref(0);
const currentTrack = computed(() => tracks[trackIndex.value]);

const progressPct = computed(() => {
  return (currentTime.value / currentTrack.value.duration) * 100;
});

let playTimer: any = null;

function togglePlay() {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    playTimer = setInterval(() => {
      if (currentTime.value >= currentTrack.value.duration) {
        nextTrack();
      } else {
        currentTime.value++;
      }
    }, 1000);
  } else {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
  }
}

function nextTrack() {
  trackIndex.value = (trackIndex.value + 1) % tracks.length;
  resetProgress();
}

function prevTrack() {
  trackIndex.value = (trackIndex.value - 1 + tracks.length) % tracks.length;
  resetProgress();
}

function resetProgress() {
  currentTime.value = 0;
  if (!isPlaying.value) {
    togglePlay();
  }
}

function seek(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = clickX / rect.width;
  currentTime.value = Math.floor(pct * currentTrack.value.duration);
}

function formatTime(secs: number): string {
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  return `${mins}:${remSecs.toString().padStart(2, '0')}`;
}

// Estilos aleatorios para el ecualizador reactivo
function barStyle(index: number) {
  if (!isPlaying.value) return {};
  const randDelay = Math.random() * 0.8;
  const randHeight = 25 + Math.random() * 55;
  return {
    animationDelay: `${randDelay}s`,
    animationDuration: `${0.6 + Math.random() * 0.6}s`,
    height: `${randHeight}%`
  };
}

onUnmounted(() => {
  if (playTimer) clearInterval(playTimer);
});
</script>

<style scoped>
.player-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #111 0%, #050505 100%);
  padding: 24px;
}

.player-card {
  width: 100%;
  max-width: 360px;
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(217, 70, 239, 0.2);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.6), 
    0 0 25px rgba(217, 70, 239, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.album-art-area {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.art-disc {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #181824, #050508);
  border: 4px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.8), 0 0 10px rgba(217, 70, 239, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.5s ease;
}

.disc-vinyl {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff00ff 20%, #111118 70%);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(255, 0, 255, 0.4);
}

.disc-center-icon {
  width: 18px;
  height: 18px;
  color: #ffffff;
}

.disc-spinning {
  animation: spin 5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ONDAS DE SONIDO REACTIVAS */
.wave-visualizer {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.wave-bar {
  width: 4px;
  height: 8px;
  background: linear-gradient(to top, var(--neon-magenta), var(--neon-cyan));
  border-radius: 2px;
  opacity: 0.15;
  transition: all 0.3s ease;
}

.wave-active .wave-bar {
  opacity: 0.8;
  animation: wavePulse 1s ease-in-out infinite alternate;
}

@keyframes wavePulse {
  0% { transform: scaleY(1); }
  100% { transform: scaleY(1.8); }
}

.track-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
}

.track-artist {
  font-size: 0.78rem;
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
}

/* PROGRESO DE REPRODUCCIÓN */
.progress-section {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-lbl {
  font-size: 0.7rem;
  font-family: monospace;
  color: var(--text-secondary);
  width: 32px;
}

.progress-bar-bg {
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(to right, var(--neon-magenta), var(--neon-cyan));
  box-shadow: var(--glow-magenta);
}

/* BOTONES MULTIMEDIA */
.media-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.ctrl-btn-side {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.ctrl-btn-side:hover {
  background: rgba(255, 0, 255, 0.08);
  border-color: var(--neon-magenta);
  color: var(--neon-magenta);
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.2);
}

.ctrl-icon-svg {
  width: 18px;
  height: 18px;
}

.ctrl-btn-play {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--neon-magenta), var(--neon-cyan));
  border: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: var(--glow-magenta);
}

.ctrl-btn-play:hover {
  transform: scale(1.1);
  box-shadow: var(--glow-cyan);
}

.ctrl-icon-play-svg {
  width: 22px;
  height: 22px;
  fill: #ffffff;
}
</style>

<template>
  <div class="app-placeholder camera-app">
    <div class="app-header">
      <CameraIcon class="app-header-icon" />
      <div>
        <h2 class="app-title">Cámara Cyber-CRT</h2>
        <span class="app-subtitle">Capturadora óptica virtual integrada</span>
      </div>
    </div>
    <div class="camera-body">
      <!-- Visor de cámara virtual con efectos CRT/cyberpunk -->
      <div class="camera-viewfinder">
        <div class="scanlines"></div>
        <div class="crt-glow"></div>
        <div class="recording-indicator">
          <div class="rec-dot"></div>
          <span>REC</span>
        </div>
        <div class="crosshair"></div>
        <div class="viewfinder-meta">
          <span>FPS: 60.00</span>
          <span>ISO: 800</span>
          <span>F/2.8</span>
        </div>
        <span class="viewfinder-text">VISTA PREVIA DE CÁMARA VIRTUAL</span>
      </div>
    </div>
    <div class="camera-controls">
      <button class="shutter-btn" title="Tomar captura óptica"></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Camera as CameraIcon } from 'lucide-vue-next';
</script>

<style scoped>
.app-placeholder {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(10, 15, 30, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

.app-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(2, 6, 23, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.app-header-icon {
  width: 32px;
  height: 32px;
  color: #d946ef;
  filter: drop-shadow(0 0 6px #d946ef);
}

.app-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
}

.app-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

.camera-body {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* CRT Viewfinder Simulator styling */
.camera-viewfinder {
  position: relative;
  width: 100%;
  height: 100%;
  background: #020617;
  border: 1px solid rgba(217, 70, 239, 0.3);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.25) 50%
  ), linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.06),
    rgba(0, 255, 0, 0.02),
    rgba(0, 0, 255, 0.06)
  );
  background-size: 100% 4px, 6px 100%;
  pointer-events: none;
  z-index: 5;
}

.crt-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, transparent 60%, rgba(217, 70, 239, 0.15) 100%);
  pointer-events: none;
  z-index: 4;
}

.recording-indicator {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f43f5e;
  font-family: monospace;
  font-weight: bold;
  font-size: 0.85rem;
  z-index: 6;
}

.rec-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f43f5e;
  box-shadow: 0 0 8px #f43f5e;
  animation: blink 1s infinite alternate;
}

@keyframes blink {
  from { opacity: 0.2; }
  to { opacity: 1; }
}

.crosshair {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  position: relative;
  z-index: 3;
}

.crosshair::before,
.crosshair::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
}

.crosshair::before {
  top: 50%;
  left: -8px;
  width: 40px;
  height: 1px;
}

.crosshair::after {
  left: 50%;
  top: -8px;
  height: 40px;
  width: 1px;
}

.viewfinder-meta {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  font-family: monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  z-index: 6;
}

.viewfinder-text {
  position: absolute;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(217, 70, 239, 0.4);
  letter-spacing: 1px;
  margin-top: 48px;
  z-index: 3;
}

/* Camera controls bottom bar */
.camera-controls {
  height: 64px;
  background: rgba(2, 6, 23, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
}

.shutter-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 3px solid #d946ef;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(217, 70, 239, 0.25);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.shutter-btn:hover {
  transform: scale(1.05);
  background: rgba(217, 70, 239, 0.2);
  box-shadow: 0 0 18px rgba(217, 70, 239, 0.4);
}

.shutter-btn:active {
  transform: scale(0.95);
  background: #d946ef;
}
</style>

<template>
  <div class="audio-settings-container">
    <!-- PANEL DE VOLUMEN PRINCIPAL -->
    <SettingCard title="Volumen Principal" :icon="Volume2Icon">
      <div class="audio-control-panel">
        <div class="control-row">
          <!-- Icono Dinámico Interactible con Animación de Silencio -->
          <button
            class="mute-toggle-btn"
            :class="{ 'is-muted': audioStore.isMuted }"
            @click="audioStore.toggleMute"
            title="Alternar Silencio (Mute)"
          >
            <component :is="audioStore.iconType" class="volume-icon-svg" />
          </button>

          <!-- Slider Estilizado Cyberpunk/Gamer -->
          <div class="slider-wrapper">
            <input
              type="range"
              min="0"
              max="100"
              :value="audioStore.isMuted ? 0 : audioStore.volume"
              @input="onVolumeChange"
              class="cyber-slider"
              aria-label="Volumen del sistema"
            />
          </div>

          <!-- Indicador Numérico Brillante -->
          <div class="volume-display" :class="{ 'text-muted': audioStore.isMuted }">
            <span v-if="audioStore.isMuted" class="muted-label">SILENCIADO</span>
            <span v-else class="volume-percent">{{ audioStore.volume }}%</span>
          </div>
        </div>
      </div>
    </SettingCard>
  </div>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/audioStore';
import SettingCard from '@/components/ui/SettingCard.vue';
import { Volume2 as Volume2Icon } from 'lucide-vue-next';

const audioStore = useAudioStore();

function onVolumeChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  audioStore.setVolume(val);
}
</script>

<style scoped>
.audio-settings-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.35s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.audio-control-panel {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

/* Botón Mute Dinámico interactivo */
.mute-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: var(--glass-border);
  background: var(--glass-bg);
  color: var(--neon-cyan);
  cursor: pointer;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.mute-toggle-btn:hover {
  background: rgba(34, 211, 238, 0.08);
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
  transform: scale(1.05);
}

.mute-toggle-btn.is-muted {
  color: #ef4444;
  border-color: #ef4444;
}

.mute-toggle-btn.is-muted:hover {
  background: rgba(239, 68, 68, 0.08);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.25);
}

.volume-icon-svg {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.mute-toggle-btn:active .volume-icon-svg {
  transform: scale(0.9);
}

/* Envoltorio del Slider */
.slider-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
}

/* Input Range Cyber-Gamer Premium */
.cyber-slider {
  -webkit-appearance: none;
  appearance: none; /* Standard property for cross-browser compatibility */
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
}

/* Estilo del Track de Carga */
.cyber-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
}

/* Estilo del Botón de Arrastre (Thumb) - Webkit */
.cyber-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none; /* Standard property for cross-browser compatibility */
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--neon-magenta);
  border: 2px solid #ffffff;
  cursor: pointer;
  margin-top: -5px; /* Centrado vertical en el track de 6px */
  box-shadow: var(--glow-magenta);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.cyber-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
  border-color: #ffffff;
}

/* Estilo del Botón de Arrastre (Thumb) - Firefox */
.cyber-slider::-moz-range-thumb {
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: var(--neon-magenta);
  border: 2px solid #ffffff;
  cursor: pointer;
  box-shadow: var(--glow-magenta);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.cyber-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  background: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

/* Indicador de Volumen */
.volume-display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 36px;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: 8px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
  transition: all 0.3s ease;
}

.volume-display.text-muted {
  color: #ef4444;
  text-shadow: 0 0 8px rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.2);
}

.muted-label {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.volume-percent {
  font-size: 0.95rem;
}
</style>

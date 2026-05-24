<template>
  <div class="power-menu-dropdown" ref="dropdownRef" @click.stop>
    <!-- SECCIÓN 1: CONTROLES DE ESTADO RÁPIDO (INTERNET & BATERÍA) -->
    <div class="quick-status-section">
      <!-- Mini Tarjeta de Internet/Wifi -->
      <div class="quick-card wifi-card">
        <div class="quick-card-header">
          <div class="header-info">
            <WifiIcon v-if="osStore.stats.networkOnline !== false" class="card-icon wifi-on-neon" />
            <WifiOffIcon v-else class="card-icon wifi-off-neon" />
            <div class="text-group">
              <span class="card-label">Wi-Fi</span>
              <span class="card-value">{{ osStore.stats.networkOnline !== false ? 'Antor-5G' : 'Desconectado' }}</span>
            </div>
          </div>
          <!-- Botón Más Opciones (Abre Centro de Redes) -->
          <button class="more-options-btn" @click="goToNetworkSettings" title="Configurar Internet">
            <ChevronRightIcon class="chevron-icon" />
          </button>
        </div>
      </div>

      <!-- Mini Tarjeta de Batería y Ahorro de Energía -->
      <div class="quick-card battery-card" :class="{ 'saver-active': configStore.batterySaver }">
        <div class="quick-card-header">
          <div class="header-info">
            <BatteryChargingIcon v-if="osStore.stats.batteryCharging" class="card-icon battery-charging-neon" />
            <BatteryIcon v-else class="card-icon battery-neon" />
            <div class="text-group">
              <span class="card-label">Ahorro de Batería</span>
              <span class="card-value">{{ configStore.batterySaver ? 'Activado' : 'Desactivado' }}</span>
            </div>
          </div>
          <!-- Switch de Ahorro de Batería -->
          <button
            class="mini-switch"
            :class="{ 'switch-on': configStore.batterySaver }"
            @click="configStore.batterySaver = !configStore.batterySaver"
            role="switch"
            :aria-checked="configStore.batterySaver"
            title="Alternar Ahorro de Batería"
          >
            <div class="switch-bullet"></div>
          </button>
        </div>
      </div>
    </div>

    <div class="menu-divider"></div>

    <!-- SECCIÓN 2: CONTROL DESLIZANTE DE VOLUMEN RÁPIDO -->
    <div class="quick-slider-section">
      <button class="slider-icon-btn" @click="audioStore.toggleMute" title="Silenciar">
        <component :is="audioStore.iconType" class="slider-icon-svg" />
      </button>
      <input
        type="range"
        min="0"
        max="100"
        :value="audioStore.isMuted ? 0 : audioStore.volume"
        @input="onVolumeChange"
        class="quick-slider"
        aria-label="Volumen rápido"
      />
      <span class="quick-slider-val">{{ audioStore.isMuted ? 'Muted' : `${audioStore.volume}%` }}</span>
    </div>

    <div class="menu-divider"></div>

    <!-- SECCIÓN 3: BOTONES COMPACTOS DE ENERGÍA (HORIZONTAL) -->
    <div class="power-buttons-row">
      <!-- Bloquear Sesión -->
      <button type="button" class="power-btn-circle" @click="handleLock" title="Bloquear sesión">
        <LockIcon class="btn-icon circle-cyan" />
        <span class="btn-tooltip">Bloquear</span>
      </button>

      <!-- Reiniciar -->
      <button type="button" class="power-btn-circle" @click="handleRestart" title="Reiniciar sistema">
        <RotateCwIcon class="btn-icon circle-green" />
        <span class="btn-tooltip">Reiniciar</span>
      </button>

      <!-- Apagar -->
      <button type="button" class="power-btn-circle danger-circle" @click="handleShutdown" title="Apagar equipo">
        <PowerIcon class="btn-icon circle-magenta" />
        <span class="btn-tooltip">Apagar</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { useConfigStore } from '@/stores/configStore';
import { useAudioStore } from '@/stores/audioStore';
import {
  Lock as LockIcon,
  RotateCw as RotateCwIcon,
  Power as PowerIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  ChevronRight as ChevronRightIcon,
  Battery as BatteryIcon,
  BatteryCharging as BatteryChargingIcon
} from 'lucide-vue-next';

const osStore = useOSStore();
const configStore = useConfigStore();
const audioStore = useAudioStore();

const dropdownRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['close']);

function onVolumeChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  audioStore.setVolume(val);
}

function goToNetworkSettings() {
  emit('close');
  // Invocar la redirección a través de openWindow utilizando la clave registrada 'network'
  osStore.openWindow('NetworkApp');
}

// ---- Lógica de las Opciones ----

function handleShutdown() {
  emit('close');
  if (window.osAPI && typeof window.osAPI.shutdown === 'function') {
    window.osAPI.shutdown();
  } else {
    console.warn('[Power] Apagado invocado fuera del contenedor de Electron.');
    alert('Apagado físico simulado. Sesión finalizada.');
  }
}

function handleRestart() {
  emit('close');
  osStore.isBooting = true;
  osStore.windows = [];
  try {
    const audioCtx = (window as any).audioContext;
    if (audioCtx) audioCtx.close();
  } catch (e) {}

  setTimeout(() => {
    osStore.isBooting = false;
    osStore.isAuthenticated = false;
  }, 5000);
}

function handleLock() {
  emit('close');
  osStore.isAuthenticated = false;
}

// ---- Control de Cierre al Hacer Click Fuera ----
function handleOutsideClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    emit('close');
  }
}

onMounted(() => {
  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick);
  }, 20);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.power-menu-dropdown {
  position: absolute;
  top: 36px;
  right: 10px;
  width: 290px;
  background: rgba(17, 17, 27, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-color: rgba(217, 70, 239, 0.25);
  border-radius: 16px;
  padding: 14px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.5), 
    0 0 20px rgba(217, 70, 239, 0.18);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000000;
  animation: dropdownSlide 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

@keyframes dropdownSlide {
  from { opacity: 0; transform: translateY(-8px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

:global(.light-theme) .power-menu-dropdown {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.05);
}

.menu-divider {
  height: 1px;
  background: var(--glass-border);
}

:global(.light-theme) .menu-divider {
  background: rgba(0, 0, 0, 0.08);
}

/* ── SECCIÓN 1: QUICK STATUS CARDS ── */
.quick-status-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-card {
  background: rgba(255, 255, 255, 0.03);
  border: var(--glass-border);
  border-radius: 10px;
  padding: 10px 12px;
  transition: all 0.2s ease;
}

:global(.light-theme) .quick-card {
  background: rgba(0, 0, 0, 0.02);
}

.quick-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

.wifi-on-neon {
  color: var(--neon-cyan);
  filter: drop-shadow(var(--glow-cyan));
}

.wifi-off-neon {
  color: #ef4444;
}

.battery-charging-neon {
  color: var(--neon-green);
  filter: drop-shadow(var(--glow-green));
}

.battery-neon {
  color: var(--text-secondary);
}

.saver-active .battery-neon {
  color: var(--neon-green);
  filter: drop-shadow(var(--glow-green));
}

.text-group {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.card-value {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Botón Más opciones */
.more-options-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

:global(.light-theme) .more-options-btn {
  background: rgba(0, 0, 0, 0.04);
}

.more-options-btn:hover {
  background: rgba(34, 211, 238, 0.1);
  color: var(--neon-cyan);
}

.chevron-icon {
  width: 14px;
  height: 14px;
}

/* Interruptor Mini para Ahorro de Energía */
.mini-switch {
  width: 38px;
  height: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.25s ease;
  outline: none;
}

:global(.light-theme) .mini-switch {
  background: rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.1);
}

.switch-bullet {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: #94a3b8;
  border-radius: 50%;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-on {
  background: rgba(34, 197, 94, 0.15);
  border-color: var(--neon-green);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.2);
}

.switch-on .switch-bullet {
  left: 20px;
  background: var(--neon-green);
  box-shadow: var(--glow-green);
}

/* ── SECCIÓN 2: CONTROL DESLIZANTE DE VOLUMEN RÁPIDO ── */
.quick-slider-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 4px;
}

.slider-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.slider-icon-btn:hover {
  color: var(--neon-cyan);
}

.slider-icon-svg {
  width: 16px;
  height: 16px;
}

.quick-slider {
  -webkit-appearance: none;
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;
}

:global(.light-theme) .quick-slider {
  background: rgba(0, 0, 0, 0.06);
}

.quick-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: var(--neon-cyan);
  cursor: pointer;
  box-shadow: var(--glow-cyan);
  transition: transform 0.2s ease;
}

.quick-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.quick-slider-val {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.72rem;
  font-weight: bold;
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
  width: 42px;
  text-align: right;
}

/* ── SECCIÓN 3: BOTONES COMPACTOS DE ENERGÍA ── */
.power-buttons-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 4px 0 2px;
}

.power-btn-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: var(--glass-border);
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.light-theme) .power-btn-circle {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.08);
}

.btn-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.power-btn-circle:hover {
  transform: scale(1.08) translateY(-2px);
  background: rgba(255, 255, 255, 0.05);
}

:global(.light-theme) .power-btn-circle:hover {
  background: rgba(0, 0, 0, 0.04);
}

/* Iluminaciones individuales hover */
.power-btn-circle:hover .circle-cyan {
  color: var(--neon-cyan);
  filter: drop-shadow(var(--glow-cyan));
}
.power-btn-circle:hover:not(.danger-circle) {
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.power-btn-circle:hover .circle-green {
  color: var(--neon-green);
  filter: drop-shadow(var(--glow-green));
}

.danger-circle:hover {
  border-color: var(--neon-magenta) !important;
  box-shadow: var(--glow-magenta) !important;
  background: rgba(244, 63, 94, 0.08) !important;
}

.danger-circle:hover .circle-magenta {
  color: var(--neon-magenta);
  filter: drop-shadow(var(--glow-magenta));
}

/* Colores acentuados */
.circle-cyan { color: var(--text-secondary); }
.circle-green { color: var(--text-secondary); }
.circle-magenta { color: var(--text-secondary); }

/* Tooltip (Leyenda emergente) */
.btn-tooltip {
  position: absolute;
  bottom: -22px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--text-secondary);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.power-btn-circle:hover .btn-tooltip {
  opacity: 1;
}
</style>

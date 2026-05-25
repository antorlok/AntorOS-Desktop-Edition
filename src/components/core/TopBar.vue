<template>
  <header class="shell-top-bar" aria-label="Barra superior del sistema">
    <!-- Izquierda: Botón de Aplicaciones -->
    <div class="top-bar-left">
      <button
        id="activities-btn"
        class="activities-btn"
        :class="{ 'activities-active': osStore.isLauncherOpen }"
        @click="osStore.toggleLauncher"
        aria-haspopup="true"
        :aria-expanded="osStore.isLauncherOpen"
      >
        <LayoutGridIcon class="activities-icon" />
        <span class="activities-text">Aplicaciones</span>
      </button>
    </div>

    <!-- Centro: Reloj del Sistema (Fecha y Hora) -->
    <div class="top-bar-center">
      <time class="system-time" :datetime="isoDateTime">{{ formattedTime }}</time>
    </div>

    <!-- Derecha: Área de Estado y Menú de Energía -->
    <div class="top-bar-right">
      <!-- Indicador de CPU en TopBar -->
      <div v-if="configStore.showTopbarCpu" class="stat-chip cpu-chip" title="Carga de CPU">
        <CpuIcon class="stat-chip-icon" />
        <span class="stat-value">{{ Math.round(osStore.stats.cpu_usage) }}%</span>
        <div class="stat-progress-bg">
          <div
            class="stat-progress-fill cpu-fill"
            :style="{ width: `${osStore.stats.cpu_usage}%` }"
          ></div>
        </div>
      </div>

      <!-- Indicador de RAM en TopBar -->
      <div 
        v-if="configStore.showTopbarRam" 
        class="stat-chip ram-chip" 
        :class="{ 'ram-danger-blink': memoryStore.ramPercentage > 85 }"
        :title="`Uso de RAM simulado: ${(memoryStore.usedRAM / 1024).toFixed(1)}GB / 8GB`"
      >
        <LayersIcon class="stat-chip-icon" />
        <span class="stat-value ram-text-val">{{ (memoryStore.usedRAM / 1024).toFixed(1) }}GB/8GB</span>
        <div class="stat-progress-bg">
          <div
            class="stat-progress-fill ram-fill"
            :style="{ width: `${memoryStore.ramPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Indicador de Temperatura en TopBar -->
      <div v-if="configStore.showTopbarTemp" class="stat-chip temp-chip" title="Temperatura de CPU">
        <ThermometerIcon class="stat-chip-icon" />
        <span class="stat-value">{{ Math.round(osStore.stats.cpu_temp ?? 42) }}°C</span>
        <div class="stat-progress-bg">
          <div
            class="stat-progress-fill temp-fill"
            :style="{ width: `${Math.min(100, Math.round(osStore.stats.cpu_temp ?? 42))}%` }"
          ></div>
        </div>
      </div>

      <div
        class="status-area-trigger"
        :class="{ 'status-trigger-active': showPowerMenu }"
        @click.stop="showPowerMenu = !showPowerMenu"
        title="Opciones de energía y estado"
      >
        <!-- Icono de Red/Internet -->
        <WifiIcon v-if="osStore.stats.networkOnline !== false" class="status-icon wifi-neon" />
        <WifiOffIcon v-else class="status-icon wifi-off-neon" />

        <!-- Icono de Sonido -->
        <VolumeIcon class="status-icon volume-neon" />

        <!-- Icono de Batería Dinámico -->
        <BatteryChargingIcon v-if="osStore.stats.batteryCharging" class="status-icon battery-charging-neon" />
        <template v-else>
          <BatteryFullIcon v-if="batteryLevel >= 80" class="status-icon battery-full-neon" />
          <BatteryMediumIcon v-else-if="batteryLevel >= 20" class="status-icon battery-medium-neon" />
          <BatteryLowIcon v-else class="status-icon battery-low-neon" />
        </template>

        <!-- Icono de Energía -->
        <PowerIcon class="status-icon power-neon" />
      </div>

      <!-- Menú Dropdown Contextual de Energía -->
      <PowerMenu v-if="showPowerMenu" @close="showPowerMenu = false" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { useConfigStore } from '@/stores/configStore';
import { useMemoryStore } from '@/stores/memoryStore';
import PowerMenu from '@/components/core/PowerMenu.vue';
import {
  LayoutGrid as LayoutGridIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Volume2 as VolumeIcon,
  BatteryCharging as BatteryChargingIcon,
  BatteryFull as BatteryFullIcon,
  BatteryMedium as BatteryMediumIcon,
  BatteryLow as BatteryLowIcon,
  Power as PowerIcon,
  Cpu as CpuIcon,
  Layers as LayersIcon,
  Thermometer as ThermometerIcon
} from 'lucide-vue-next';

const osStore = useOSStore();
const configStore = useConfigStore();
const memoryStore = useMemoryStore();

const showPowerMenu = ref(false);

const batteryLevel = computed(() => osStore.stats.batteryLevel ?? 100);

// ---- Reloj en Tiempo Real (Estilo Cyber-GNOME) ----
const formattedTime = ref('');
const isoDateTime = ref('');
let clockInterval: ReturnType<typeof setInterval>;

function updateClock() {
  const now = new Date();
  isoDateTime.value = now.toISOString();
  
  // Formato: "jue 22 may 01:00" estilo GNOME Shell en español
  formattedTime.value = now.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');
}

onMounted(() => {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  clearInterval(clockInterval);
});
</script>

<style scoped>
/* ── BARRA SUPERIOR (Top Bar - 32px) ── */
.shell-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  width: 100%;
  padding: 0 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: var(--glass-border);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  pointer-events: auto; /* Reactivar clicks en la barra */
  user-select: none;
  transition: background-color 0.3s, border-color 0.3s;
  position: relative;
}

.top-bar-left, .top-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

/* Botón Aplicaciones */
.activities-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.activities-btn:hover {
  background: rgba(34, 211, 238, 0.08);
  color: var(--neon-cyan);
  border-color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.1);
}

.activities-active {
  background: rgba(34, 211, 238, 0.15) !important;
  color: var(--neon-cyan) !important;
  border-color: var(--neon-cyan) !important;
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.25);
  text-shadow: var(--glow-cyan);
}

.activities-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.25s ease;
}

.activities-btn:hover .activities-icon {
  transform: rotate(15deg);
}

/* Reloj Centrado de forma Absoluta en la Barra Superior */
.top-bar-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* Evitar interferencias con la barra superior interactiva */
}

/* Reloj Centrado */
.system-time {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.5px;
  text-transform: capitalize;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.05);
}

/* Área de Estado interactiva (Gamer-Neon) */
.status-area-trigger {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: 8px;
  padding: 0 12px;
  height: 24px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.status-area-trigger:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(217, 70, 239, 0.4);
  box-shadow: 0 0 10px rgba(217, 70, 239, 0.15);
  transform: translateY(-0.5px);
}

.status-trigger-active {
  background: rgba(217, 70, 239, 0.1) !important;
  border-color: var(--neon-magenta) !important;
  box-shadow: 0 0 12px rgba(217, 70, 239, 0.3) !important;
}

.status-icon {
  width: 14px;
  height: 14px;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

/* Colores e iluminaciones neón individuales */
.wifi-neon {
  color: var(--neon-cyan);
}
.wifi-off-neon {
  color: #ef4444;
  filter: drop-shadow(0 0 4px #ef4444);
}
.volume-neon {
  color: var(--text-secondary);
}
.status-area-trigger:hover .volume-neon {
  color: var(--neon-cyan);
  filter: drop-shadow(0 0 4px var(--neon-cyan));
}
.battery-charging-neon {
  color: var(--neon-green);
  filter: drop-shadow(0 0 4px var(--neon-green));
}
.battery-full-neon {
  color: var(--neon-green);
}
.battery-medium-neon {
  color: #eab308;
}
.battery-low-neon {
  color: #ef4444;
  animation: lowBatteryBlink 1.5s infinite alternate;
}
.power-neon {
  color: var(--text-secondary);
}
.status-area-trigger:hover .power-neon {
  color: var(--neon-magenta);
  filter: drop-shadow(0 0 4px var(--neon-magenta));
}

@keyframes lowBatteryBlink {
  from { opacity: 0.4; }
  to { opacity: 1; filter: drop-shadow(0 0 4px #ef4444); }
}

/* Chips de Telemetría en la Barra Superior */
.stat-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: 6px;
  padding: 2px 8px;
  height: 22px;
  transition: all 0.2s ease;
}

.stat-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--neon-cyan);
}

.stat-chip-icon {
  width: 12px;
  height: 12px;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.stat-value {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--text-secondary);
  width: 32px;
  text-align: right;
}

/* Micro-barras de progreso */
.stat-progress-bg {
  width: 40px;
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.stat-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cpu-fill {
  background: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.ram-fill {
  background: var(--neon-magenta);
  box-shadow: var(--glow-magenta);
}

.temp-fill {
  background: var(--neon-green);
  box-shadow: var(--glow-green);
}

.cpu-chip:hover .stat-chip-icon {
  color: var(--neon-cyan);
  filter: drop-shadow(var(--glow-cyan));
}

.ram-chip:hover .stat-chip-icon {
  color: var(--neon-magenta);
  filter: drop-shadow(var(--glow-magenta));
}

.ram-text-val {
  width: auto !important;
  min-width: 65px;
  text-align: center;
}

.ram-danger-blink {
  border-color: var(--neon-magenta) !important;
  color: var(--neon-magenta) !important;
  animation: ramBlink 2s infinite !important;
}

.ram-danger-blink .stat-chip-icon {
  color: var(--neon-magenta) !important;
}

@keyframes ramBlink {
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px var(--neon-magenta)); }
  50% { opacity: 0.6; }
}

.temp-chip:hover .stat-chip-icon {
  color: var(--neon-green);
  filter: drop-shadow(var(--glow-green));
}
</style>

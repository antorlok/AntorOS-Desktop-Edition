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
  Power as PowerIcon
} from 'lucide-vue-next';

const osStore = useOSStore();

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
</style>

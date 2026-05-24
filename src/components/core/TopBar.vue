<template>
  <header class="shell-top-bar" aria-label="Barra superior del sistema">
    <!-- Izquierda: Botón de Actividades -->
    <div class="top-bar-left">
      <button
        id="activities-btn"
        class="activities-btn"
        :class="{ 'activities-active': osStore.isLauncherOpen }"
        @click="osStore.toggleLauncher"
        aria-haspopup="true"
        :aria-expanded="osStore.isLauncherOpen"
      >
        <ActivityIcon class="activities-icon" />
        <span class="activities-text">Actividades</span>
      </button>
    </div>

    <!-- Centro: Reloj del Sistema (Fecha y Hora) -->
    <div class="top-bar-center">
      <time class="system-time" :datetime="isoDateTime">{{ formattedTime }}</time>
    </div>

    <!-- Derecha: Indicadores de Telemetría en Tiempo Real -->
    <div class="top-bar-right">
      <!-- Indicador de CPU -->
      <div class="stat-chip cpu-chip" title="Carga de CPU">
        <CpuIcon class="stat-icon" />
        <span class="stat-value">{{ cpuUsagePercent }}%</span>
        <div class="stat-progress-bg">
          <div
            class="stat-progress-fill cpu-fill"
            :style="{ width: `${osStore.stats.cpu_usage}%` }"
          ></div>
        </div>
      </div>

      <!-- Indicador de RAM -->
      <div class="stat-chip ram-chip" title="Uso de RAM">
        <LayersIcon class="stat-icon" />
        <span class="stat-value">{{ ramUsagePercent }}%</span>
        <div class="stat-progress-bg">
          <div
            class="stat-progress-fill ram-fill"
            :style="{ width: `${osStore.stats.ram_usage}%` }"
          ></div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { Activity as ActivityIcon, Cpu as CpuIcon, Layers as LayersIcon } from 'lucide-vue-next';

const osStore = useOSStore();

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

// ---- Redondear telemetría para los chips ----
const cpuUsagePercent = computed(() => Math.round(osStore.stats.cpu_usage));
const ramUsagePercent = computed(() => Math.round(osStore.stats.ram_usage));
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
}

.top-bar-left, .top-bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Botón Actividades */
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

/* Chips de Telemetría */
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

.stat-icon {
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
  width: 28px;
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
  background: #22d3ee;
  box-shadow: 0 0 5px #22d3ee;
}

.ram-fill {
  background: #d946ef;
  box-shadow: 0 0 5px #d946ef;
}

.cpu-chip:hover .stat-icon {
  color: #22d3ee;
  filter: drop-shadow(0 0 4px #22d3ee);
}

.ram-chip:hover .stat-icon {
  color: #d946ef;
  filter: drop-shadow(0 0 4px #d946ef);
}
</style>

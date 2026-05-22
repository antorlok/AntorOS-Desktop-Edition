<template>
  <div class="shell-container">
    <!-- ── TOP BAR (Estilo GNOME Shell Cyberpunk) ── -->
    <header class="shell-top-bar" aria-label="Barra superior del sistema">
      <!-- Izquierda: Botón de Actividades -->
      <div class="top-bar-left">
        <button
          id="activities-btn"
          class="activities-btn"
          :class="{ 'activities-active': isLauncherOpen }"
          @click="toggleLauncher"
          aria-haspopup="true"
          :aria-expanded="isLauncherOpen"
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

    <!-- ── LAUNCHER OVERVIEW (App Grid con Difuminación de Fondo) ── -->
    <Transition name="launcher-anim">
      <div
        v-if="isLauncherOpen"
        class="launcher-overlay"
        @click.self="toggleLauncher"
      >
        <div class="launcher-dialog">
          <!-- Campo de Búsqueda de Apps -->
          <div class="search-box">
            <SearchIcon class="search-icon" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Buscar aplicación..."
              spellcheck="false"
              autocomplete="off"
              @keydown.escape="toggleLauncher"
            />
          </div>

          <!-- Rejilla de Apps (App Grid) -->
          <div class="app-grid" role="navigation" aria-label="Aplicaciones del sistema">
            <button
              v-for="app in filteredApps"
              :key="app.id"
              class="app-card"
              @click="launchApp(app)"
            >
              <div class="app-icon-container">
                <component :is="app.icon" class="app-icon" />
                <div class="app-icon-glow"></div>
              </div>
              <span class="app-title">{{ app.title }}</span>
            </button>
            
            <!-- Sin resultados -->
            <div v-if="filteredApps.length === 0" class="empty-state">
              Ninguna aplicación coincide con la búsqueda.
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { SYSTEM_APPS, type AppRegistryEntry } from '@/registry/apps';
import { Activity as ActivityIcon, Cpu as CpuIcon, Layers as LayersIcon, Search as SearchIcon } from 'lucide-vue-next';

const osStore = useOSStore();

// ---- Estado del Lanzador (Activities Menu) ----
const isLauncherOpen = ref(false);
const searchQuery = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

function toggleLauncher() {
  isLauncherOpen.value = !isLauncherOpen.value;
  searchQuery.value = '';

  // Enfocar buscador al abrir
  if (isLauncherOpen.value) {
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
}

// Filtrar las apps en la rejilla en tiempo real
const filteredApps = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return SYSTEM_APPS;
  return SYSTEM_APPS.filter(
    (app) =>
      app.title.toLowerCase().includes(query) ||
      app.name.toLowerCase().includes(query)
  );
});

// Lanzar aplicación e inmediatamente cerrar el Shell Launcher
function launchApp(app: AppRegistryEntry) {
  osStore.openWindow(app.name, app.title, app.defaultWidth, app.defaultHeight);
  isLauncherOpen.value = false;
  searchQuery.value = '';
}

// ---- Reloj en Tiempo Real (Estilo GNOME) ----
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
.shell-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none; /* Permite clicks a través, salvo en barra y overlay */
  z-index: 999980;
}

/* ── BARRA SUPERIOR (Top Bar - 32px) ── */
.shell-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  width: 100%;
  padding: 0 16px;
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  pointer-events: auto; /* Reactivar clicks en la barra */
  user-select: none;
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
  padding: 0 10px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.activities-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--neon-cyan);
  border-color: rgba(0, 243, 255, 0.2);
}

.activities-active {
  background: rgba(0, 243, 255, 0.1) !important;
  color: var(--neon-cyan) !important;
  border-color: var(--neon-cyan) !important;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.15);
}

.activities-icon {
  width: 14px;
  height: 14px;
}

/* Reloj Centrado */
.system-time {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
  text-transform: capitalize;
}

/* Chips de Telemetría */
.stat-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 2px 8px;
  height: 22px;
}

.stat-icon {
  width: 12px;
  height: 12px;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s ease;
}

.stat-value {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  width: 28px;
  text-align: right;
}

/* Micro-barras de progreso */
.stat-progress-bg {
  width: 40px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
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
  box-shadow: 0 0 5px var(--neon-cyan);
}

.ram-fill {
  background: var(--neon-magenta);
  box-shadow: 0 0 5px var(--neon-magenta);
}

.cpu-chip:hover .stat-icon { color: var(--neon-cyan); }
.ram-chip:hover .stat-icon { color: var(--neon-magenta); }

/* ── LAUNCHER OVERVIEW (App Grid Overlay) ── */
.launcher-overlay {
  position: fixed;
  inset: 32px 0 0 0; /* Ubicado exactamente debajo de la barra superior */
  width: 100vw;
  height: calc(100vh - 32px);
  background: rgba(5, 5, 5, 0.75);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
  pointer-events: auto;
}

.launcher-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  gap: 40px;
}

/* Buscador Estilo Cyberpunk */
.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 500px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 30px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-box:focus-within {
  border-color: var(--neon-cyan);
  box-shadow: 
    0 0 15px rgba(0, 243, 255, 0.25),
    inset 0 0 8px rgba(0, 243, 255, 0.05);
  background: rgba(255, 255, 255, 0.05);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.3s ease;
}

.search-box:focus-within .search-icon {
  color: var(--neon-cyan);
  filter: drop-shadow(0 0 4px var(--neon-cyan));
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-family: inherit;
  font-size: 1rem;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

/* Cuadrícula de Aplicaciones (App Grid) */
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 24px;
  width: 100%;
  justify-content: center;
  padding: 20px;
}

.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 20px 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-card:hover {
  background: rgba(0, 243, 255, 0.04);
  border-color: rgba(0, 243, 255, 0.3);
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.app-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  transition: all 0.25s ease;
}

.app-icon {
  width: 30px;
  height: 30px;
  transition: all 0.25s ease;
  z-index: 2;
}

.app-icon-glow {
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  background: radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 1;
}

.app-card:hover .app-icon-container {
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);
}

.app-card:hover .app-icon {
  filter: drop-shadow(0 0 6px var(--neon-cyan));
}

.app-card:hover .app-icon-glow {
  opacity: 0.15;
}

/* Efectos alternos neón para cada app */
.app-card:nth-child(2n):hover {
  background: rgba(255, 0, 255, 0.04);
  border-color: rgba(255, 0, 255, 0.3);
}
.app-card:nth-child(2n):hover .app-icon-container {
  border-color: var(--neon-magenta);
  color: var(--neon-magenta);
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.2);
}
.app-card:nth-child(2n):hover .app-icon {
  filter: drop-shadow(0 0 6px var(--neon-magenta));
}
.app-card:nth-child(2n):hover .app-icon-glow {
  background: radial-gradient(circle, var(--neon-magenta) 0%, transparent 70%);
  opacity: 0.15;
}

.app-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
  text-align: center;
  transition: color 0.25s ease;
}

.app-card:hover .app-title {
  color: #ffffff;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.9rem;
  padding: 40px 0;
  letter-spacing: 0.5px;
}

/* ── ANIMACIONES DE TRANSICIÓN ── */
.launcher-anim-enter-active,
.launcher-anim-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.launcher-anim-enter-active .launcher-dialog {
  animation: scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.launcher-anim-leave-active .launcher-dialog {
  animation: scale-down 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.launcher-anim-enter-from,
.launcher-anim-leave-to {
  opacity: 0;
}

@keyframes scale-up {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes scale-down {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(15px);
  }
}
</style>

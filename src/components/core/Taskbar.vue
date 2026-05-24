<template>
  <div class="taskbar-container">
    <!-- Lanzadores de Aplicaciones Dinámicos (Anclados + Abiertos) -->
    <div class="dock-launchers" role="toolbar" aria-label="Acceso rápido a aplicaciones">
      <button 
        v-for="app in dockApps" 
        :key="app.id"
        class="launcher-icon"
        :title="app.title"
        @click="launchApp(app)"
        @contextmenu.prevent.stop="handleRightClick($event, app)"
      >
        <component :is="app.icon" class="icon-svg" />
        <div class="launcher-dot" :class="{ 'is-running': isAppRunning(app.name) }"></div>
      </button>
    </div>

    <!-- Separador Cyberpunk (Solo visible si hay telemetría activa en el dock) -->
    <div v-if="hasTelemetry" class="dock-divider"></div>

    <!-- HUD de Telemetría Condicional (Derecha) -->
    <div v-if="hasTelemetry" class="telemetry-hud" aria-label="Estadísticas de hardware">
      <span v-if="configStore.showDockCpu" class="hud-item cpu-hud">
        CPU <span class="hud-value">{{ osStore.stats.cpu_usage.toFixed(1).padStart(5, '0') }}%</span>
      </span>
      <span v-if="configStore.showDockCpu && (configStore.showDockRam || configStore.showDockTemp)" class="hud-separator">|</span>
      <span v-if="configStore.showDockRam" class="hud-item ram-hud">
        RAM <span class="hud-value">{{ osStore.stats.ram_usage.toFixed(1).padStart(5, '0') }}%</span>
      </span>
      <span v-if="configStore.showDockRam && configStore.showDockTemp" class="hud-separator">|</span>
      <span v-if="configStore.showDockTemp" class="hud-item temp-hud">
        TEMP <span class="hud-value">{{ (osStore.stats.cpu_temp ?? 42).toFixed(1).padStart(4, '0') }}°C</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { useConfigStore } from '@/stores/configStore';
import { SYSTEM_APPS, type AppRegistryEntry } from '@/registry/apps';

const osStore = useOSStore();
const configStore = useConfigStore();

let clickTimeout: ReturnType<typeof setTimeout> | null = null;

// Determinar dinámicamente qué aplicaciones se renderizan en el Dock (ancladas O ejecutándose)
const dockApps = computed(() => {
  return SYSTEM_APPS.filter((app) => 
    configStore.isAppPinned(app.id) || osStore.windows.some((w) => w.appName === app.name)
  );
});

// Comprobar reactivamente si hay alguna telemetría activa para mostrar la sección
const hasTelemetry = computed(() => {
  return configStore.showDockCpu || configStore.showDockRam || configStore.showDockTemp;
});

function launchApp(app: AppRegistryEntry) {
  if (clickTimeout) {
    // Si ya existe un timeout activo, significa que es el segundo click (Doble Click)
    clearTimeout(clickTimeout);
    clickTimeout = null;
    
    // Doble click: Abrir una nueva ventana incondicionalmente
    osStore.openWindow(app);
  } else {
    // Es el primer click: Esperamos 250ms para ver si hay un segundo click
    clickTimeout = setTimeout(() => {
      clickTimeout = null;
      
      // Click simple:
      // Comprobamos si la aplicación ya tiene alguna ventana abierta en el sistema
      const runningApp = osStore.windows.find((w) => w.appName === app.name);
      if (runningApp) {
        // Enfocamos y desminimizamos la ventana existente
        osStore.focusWindow(runningApp.id);
      } else {
        // Si no está abierta, creamos una nueva instancia
        osStore.openWindow(app);
      }
    }, 250);
  }
}

/**
 * Capturar click derecho sobre los iconos del Dock para desplegar el Menú Contextual
 */
function handleRightClick(event: MouseEvent, app: AppRegistryEntry) {
  event.stopPropagation();
  osStore.openContextMenu(event.clientX, event.clientY, app, 'dock');
}

/**
 * Retorna true si hay alguna ventana abierta con el appName especificado.
 * Esto permite encender un micro-indicador de ejecución debajo del icono.
 */
function isAppRunning(appName: string): boolean {
  return osStore.windows.some((w) => w.appName === appName);
}
</script>

<style scoped>
/* Contenedor principal de la Taskbar Dock */
.taskbar-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding: 8px 24px;
  
  /* Glassmorphism Cyber-Gamer Premium */
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: var(--glass-border);
  border-radius: 20px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.2), 
    inset 0 0 15px rgba(34, 211, 238, 0.05);
  
  z-index: 99999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.taskbar-container:hover {
  border-color: var(--neon-magenta);
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.3), 
    inset 0 0 20px rgba(217, 70, 239, 0.1);
}

/* Lanzadores (Dock List) */
.dock-launchers {
  display: flex;
  gap: 14px;
  align-items: center;
}

/* Iconos de Lanzadores */
.launcher-icon {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-svg {
  width: 28px;
  height: 28px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efectos de Hover Premium: Escalar 1.1 y Brillar con Magenta Neón */
.launcher-icon:hover {
  transform: scale(1.1) translateY(-4px);
  color: var(--neon-magenta);
}

.launcher-icon:hover .icon-svg {
  filter: drop-shadow(var(--glow-magenta));
}

/* Indicador de aplicación en ejecución (Dot) */
.launcher-dot {
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.25s ease;
}

.launcher-dot.is-running {
  background: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.launcher-icon:hover .launcher-dot.is-running {
  background: var(--neon-magenta);
  box-shadow: var(--glow-magenta);
}

/* Separador de Dock y HUD */
.dock-divider {
  width: 1px;
  height: 36px;
  background: var(--glass-border);
  border-radius: 1px;
  margin: 0 16px 0 10px;
  transition: background 0.3s ease;
}

.taskbar-container:hover .dock-divider {
  background: var(--neon-magenta);
  opacity: 0.4;
}

/* HUD de Telemetría */
.telemetry-hud {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.cpu-hud {
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
}

.ram-hud {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
}

.temp-hud {
  color: var(--neon-green);
  text-shadow: var(--glow-green);
}

.hud-value {
  font-weight: bold;
  display: inline-block;
}

.hud-separator {
  color: var(--glass-border);
}
</style>

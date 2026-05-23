<template>
  <div class="taskbar-container">
    <!-- Lanzadores de Aplicaciones (Izquierda/Centro) -->
    <div class="dock-launchers" role="toolbar" aria-label="Acceso rápido a aplicaciones">
      <button 
        v-for="app in SYSTEM_APPS" 
        :key="app.id"
        class="launcher-icon"
        :title="app.title"
        @click="launchApp(app)"
      >
        <component :is="app.icon" class="icon-svg" />
        <div class="launcher-dot" :class="{ 'is-running': isAppRunning(app.name) }"></div>
      </button>
    </div>

    <!-- Separador Cyberpunk -->
    <div class="dock-divider"></div>

    <!-- HUD de Telemetría (Derecha) -->
    <div class="telemetry-hud" aria-label="Estadísticas de hardware">
      <span class="hud-item cpu-hud">
        CPU <span class="hud-value">{{ osStore.stats.cpu_usage.toFixed(1).padStart(5, '0') }}%</span>
      </span>
      <span class="hud-separator">|</span>
      <span class="hud-item ram-hud">
        RAM <span class="hud-value">{{ osStore.stats.ram_usage.toFixed(1).padStart(5, '0') }}%</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOSStore } from '@/stores/osStore';
import { SYSTEM_APPS, type AppRegistryEntry } from '@/registry/apps';

const osStore = useOSStore();

function launchApp(app: AppRegistryEntry) {
  // openWindow ahora acepta el objeto completo de forma nativa e integrada
  osStore.openWindow(app);
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
  gap: 20px;
  padding: 8px 24px;
  
  /* Glassmorphism Cyber-Gamer Premium */
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 20px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6), 
    inset 0 0 15px rgba(34, 211, 238, 0.05);
  
  z-index: 99999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.taskbar-container:hover {
  border-color: rgba(217, 70, 239, 0.3);
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.7), 
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
  background: transparent; /* Quitado el recuadro gris de fondo */
  border: none; /* Sin bordes grises */
  cursor: pointer;
  color: rgba(255, 255, 255, 0.75);
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-svg {
  width: 28px; /* Iconos más grandes como se solicitó */
  height: 28px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efectos de Hover Premium: Escalar 1.1 y Brillar con Magenta Neón */
.launcher-icon:hover {
  transform: scale(1.1) translateY(-4px);
  color: #d946ef;
}

.launcher-icon:hover .icon-svg {
  filter: drop-shadow(0 0 8px #d946ef);
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
  background: #22d3ee;
  box-shadow: 0 0 6px #22d3ee;
}

.launcher-icon:hover .launcher-dot.is-running {
  background: #d946ef;
  box-shadow: 0 0 8px #d946ef;
}

/* Separador de Dock y HUD */
.dock-divider {
  width: 1px;
  height: 36px;
  background: rgba(34, 211, 238, 0.2);
  border-radius: 1px;
  transition: background 0.3s ease;
}

.taskbar-container:hover .dock-divider {
  background: rgba(217, 70, 239, 0.25);
}

/* HUD de Telemetría */
.telemetry-hud {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.cpu-hud {
  color: rgba(34, 211, 238, 0.85);
}

.ram-hud {
  color: rgba(217, 70, 239, 0.85);
}

.hud-value {
  font-weight: bold;
  text-shadow: 0 0 6px currentColor;
  display: inline-block;
}

.hud-separator {
  color: rgba(255, 255, 255, 0.15);
}
</style>

<template>
  <div class="taskbar-container">
    <!-- Lanzadores de Aplicaciones (Izquierda/Centro) -->
    <div class="dock-launchers">
      <div 
        v-for="app in SYSTEM_APPS" 
        :key="app.id"
        class="launcher-icon"
        :title="app.title"
        @click="launchApp(app)"
      >
        <component :is="app.icon" class="icon-svg" />
      </div>
    </div>

    <!-- Separador -->
    <div class="dock-divider"></div>

    <!-- HUD de Telemetría (Derecha) -->
    <div class="telemetry-hud">
      <span class="hud-text">
        CPU: <span class="hud-value">{{ osStore.stats.cpu_usage.toFixed(1).padStart(4, '0') }}%</span>
      </span>
      <span class="hud-separator">|</span>
      <span class="hud-text">
        RAM: <span class="hud-value">{{ osStore.stats.ram_usage.toFixed(1).padStart(4, '0') }}%</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOSStore } from '@/stores/osStore';
import { SYSTEM_APPS, type AppRegistryEntry } from '@/registry/apps';

const osStore = useOSStore();

function launchApp(app: AppRegistryEntry) {
  osStore.openWindow(app.name, app.title, app.defaultWidth, app.defaultHeight);
}
</script>

<style scoped>
.taskbar-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 24px;
  
  /* Glassmorphism Gamer-Neon */
  background: rgba(17, 17, 17, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(0, 243, 255, 0.05);
  
  z-index: 99999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.taskbar-container:hover {
  border-color: rgba(255, 0, 255, 0.3);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 0, 255, 0.1);
}

/* Lanzadores */
.dock-launchers {
  display: flex;
  gap: 12px;
  align-items: center;
}

.launcher-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  color: #fff;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-svg {
  width: 24px;
  height: 24px;
  transition: all 0.2s ease;
}

/* Hover effects Neon */
.launcher-icon:hover {
  transform: translateY(-5px) scale(1.05);
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--neon-cyan);
  box-shadow: 0 5px 15px rgba(0, 243, 255, 0.3);
}

.launcher-icon:hover .icon-svg {
  color: var(--neon-cyan);
  filter: drop-shadow(0 0 5px var(--neon-cyan));
}

.dock-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1px;
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

.hud-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hud-value {
  color: var(--neon-magenta);
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.4);
  width: 45px;
  display: inline-block;
}

.hud-separator {
  color: rgba(255, 255, 255, 0.2);
}
</style>

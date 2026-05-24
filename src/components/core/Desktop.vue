<template>
  <div
    class="desktop-environment"
    :class="{ 'light-theme': configStore.theme === 'light' }"
    :style="{ backgroundImage: `url(${configStore.wallpaper})` }"
  >
    <!-- Capa de difuminado reactiva con transiciones ultra suaves -->
    <div
      class="desktop-blur-layer"
      :class="{ 'blur-active': configStore.blurEnabled }"
    ></div>

    <!-- Shell Superior de Control (Reloj + Actividades + Telemetría) -->
    <Shell />

    <!-- Área exclusiva para contener y restringir el movimiento de ventanas -->
    <div class="workspace-area">
      <!-- Renderizado dinámico de todas las ventanas activas en el OS -->
      <template v-for="win in osStore.windows" :key="win.id">
        <WindowFrame :window="win">
          <!-- Inyección asíncrona de la aplicación según su nombre registrado -->
          <component :is="getAppComponent(win.appName)" />
        </WindowFrame>
      </template>
    </div>

    <!-- Taskbar Centralizada (Dock + HUD) -->
    <Transition name="dock-fade">
      <Taskbar v-if="configStore.dockEnabled" />
    </Transition>

    <!-- Menú Contextual Global de Aplicaciones (Cyber-Neon / Adaptable) -->
    <ContextMenu />

    <!-- Pantalla completa de Animación de Arranque / Reinicio Gamer-Neón -->
    <Transition name="fade">
      <BootAnimation v-if="osStore.isBooting" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Component } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { useConfigStore } from '@/stores/configStore';
import Shell from '@/components/core/Shell.vue';
import WindowFrame from '@/components/core/WindowFrame.vue';
import Taskbar from '@/components/core/Taskbar.vue';
import ContextMenu from '@/components/core/ContextMenu.vue';
import BootAnimation from '@/components/core/BootAnimation.vue';

const osStore = useOSStore();
const configStore = useConfigStore();

// Registro local asíncrono para Lazy Loading de las apps del SO
const appRegistry: Record<string, Component> = {
  BrowserApp: defineAsyncComponent(() => import('@/components/apps/BrowserApp.vue')),
  TerminalApp: defineAsyncComponent(() => import('@/components/apps/TerminalApp.vue')),
  SettingsApp: defineAsyncComponent(() => import('@/components/apps/SettingsApp.vue')),
  MonitorApp: defineAsyncComponent(() => import('@/components/apps/SystemMonitor.vue')),
  FilesApp: defineAsyncComponent(() => import('@/components/apps/FileManager.vue')),
  NotesApp: defineAsyncComponent(() => import('@/components/apps/NotesApp.vue')),
  CameraApp: defineAsyncComponent(() => import('@/components/apps/CameraApp.vue')),
  NetworkApp: defineAsyncComponent(() => import('@/components/apps/NetworkApp.vue')),
  OfficeApp: defineAsyncComponent(() => import('@/components/apps/OfficeApp.vue')),
  CalculatorApp: defineAsyncComponent(() => import('@/components/apps/CalculatorApp.vue')),
  CalendarApp: defineAsyncComponent(() => import('@/components/apps/CalendarApp.vue')),
  ClockApp: defineAsyncComponent(() => import('@/components/apps/ClockApp.vue')),
  RecorderApp: defineAsyncComponent(() => import('@/components/apps/RecorderApp.vue')),
  StoreApp: defineAsyncComponent(() => import('@/components/apps/StoreApp.vue')),
  NeonPlayerApp: defineAsyncComponent(() => import('@/components/apps/NeonPlayerApp.vue')),
  CyberCodeApp: defineAsyncComponent(() => import('@/components/apps/CyberCodeApp.vue')),
  SysBenchApp: defineAsyncComponent(() => import('@/components/apps/SysBenchApp.vue')),
};

/**
 * Resuelve el componente de Vue correspondiente al nombre de la aplicación.
 * Si no existe, retorna un div nativo como fallback.
 */
function getAppComponent(appName: string): Component | string {
  return appRegistry[appName] || 'div';
}
</script>

<style scoped>
.desktop-environment {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--bg-dark);
}

.desktop-blur-layer {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(0px) brightness(1);
  pointer-events: none;
  z-index: 1;
  transition: backdrop-filter 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.desktop-blur-layer.blur-active {
  backdrop-filter: blur(16px) brightness(0.65);
  background-color: rgba(17, 17, 27, 0.35);
}

/* Área de trabajo por debajo del Shell superior (32px) */
.workspace-area {
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 2;
}

/* Transición fluida cyberpunk para ocultar/mostrar el Dock inferior */
.dock-fade-enter-active,
.dock-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dock-fade-enter-from,
.dock-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 28px) scale(0.94);
}
</style>


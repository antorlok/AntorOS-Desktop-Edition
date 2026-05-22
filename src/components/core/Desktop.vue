<template>
  <div class="desktop-environment">
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
    <Taskbar />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Component } from 'vue';
import { useOSStore } from '@/stores/osStore';
import Shell from '@/components/core/Shell.vue';
import WindowFrame from '@/components/core/WindowFrame.vue';
import Taskbar from '@/components/core/Taskbar.vue';

const osStore = useOSStore();

// Registro local asíncrono para Lazy Loading de las apps del SO
const appRegistry: Record<string, Component> = {
  BrowserApp: defineAsyncComponent(() => import('@/components/apps/BrowserApp.vue')),
  TerminalApp: defineAsyncComponent(() => import('@/components/apps/TerminalApp.vue')),
  SettingsApp: defineAsyncComponent(() => import('@/components/apps/SettingsApp.vue')),
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
  
  /* Fondo base del sistema con degradado Gamer-Neon */
  background: radial-gradient(circle at 50% 50%, var(--surface-base) 0%, var(--bg-dark) 100%);
}

/* Área de trabajo por debajo del Shell superior (32px) */
.workspace-area {
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
</style>


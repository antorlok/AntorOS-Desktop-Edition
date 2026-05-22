<template>
  <!-- Pantalla de bloqueo mientras no esté autenticado -->
  <LockScreen v-if="!osStore.isAuthenticated" />

  <!-- Entorno de escritorio completo (solo tras autenticación) -->
  <Desktop v-else />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useKernel } from '@/composables/useKernel';
import { useOSStore } from '@/stores/osStore';
import LockScreen from '@/components/core/LockScreen.vue';
import Desktop from '@/components/core/Desktop.vue';

const kernel = useKernel();
const osStore = useOSStore();

// Conectar al Kernel de Go inmediatamente (telemetría en la LockScreen también)
kernel.connect();

// Sincronizar stats del WebSocket hacia el store de Pinia
watch(
  () => kernel.stats.value,
  (newStats) => {
    if (newStats) osStore.updateStats(newStats);
  },
  { deep: true },
);

// Abrir ventanas de bienvenida solo cuando el usuario se autentica por primera vez
watch(
  () => osStore.isAuthenticated,
  (authenticated) => {
    if (!authenticated) return;
    osStore.openWindow('BrowserApp', 'Navegador Web', 1000, 600);
    osStore.openWindow('TerminalApp', 'Terminal de Comando', 700, 450);
  },
  { once: true },
);
</script>

<style scoped>
/* Los estilos globales están contenidos en main.css */
</style>

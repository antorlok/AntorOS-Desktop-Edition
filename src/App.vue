<template>
  <!-- Pantalla de bloqueo mientras no esté autenticado -->
  <LockScreen v-if="!osStore.isAuthenticated" />

  <!-- Entorno de escritorio completo (solo tras autenticación) -->
  <Desktop v-else />

  <!-- Pantalla completa de Animación de Arranque / Reinicio Gamer-Neón global -->
  <Transition name="fade">
    <BootAnimation v-if="osStore.isBooting" />
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useKernel } from '@/composables/useKernel';
import { useOSStore } from '@/stores/osStore';
import LockScreen from '@/components/core/LockScreen.vue';
import Desktop from '@/components/core/Desktop.vue';
import BootAnimation from '@/components/core/BootAnimation.vue';

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
</script>

<style scoped>
/* Los estilos globales están contenidos en main.css */

/* Transición fade para la animación de reinicio global */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

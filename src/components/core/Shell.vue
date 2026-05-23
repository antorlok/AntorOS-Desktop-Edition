<template>
  <div class="shell-container">
    <!-- Barra superior principal estilo Cyber-GNOME -->
    <TopBar />

    <!-- Lanzador/Menú general de aplicaciones en pantalla completa (App Grid) -->
    <AppLauncher />
  </div>
</template>

<script setup lang="ts">
import TopBar from '@/components/core/TopBar.vue';
import AppLauncher from '@/components/core/AppLauncher.vue';
</script>

<style scoped>
.shell-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none; /* Permite clicks a través de las regiones vacías del shell */
  z-index: 999980;
}
</style>

<template>
  <div class="setting-card">
    <!-- Cabecera Opcional con Icono y Título -->
    <header v-if="title || icon" class="card-header">
      <component :is="icon" v-if="icon" class="header-icon" />
      <h3 v-if="title" class="header-title">{{ title }}</h3>
    </header>

    <!-- Contenedor del slot principal para inyección de controles o campos -->
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue';

defineProps<{
  title?: string;
  icon?: Component;
}>();
</script>

<style scoped>
.setting-card {
  background-color: #1e1e2e;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px 20px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.setting-card:hover {
  border-color: rgba(229, 200, 144, 0.2);
  box-shadow: 0 4px 20px rgba(229, 200, 144, 0.03);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  padding-bottom: 8px;
}

.header-icon {
  width: 18px;
  height: 18px;
  color: #e5c890; /* Acento amarillo/dorado gamer */
}

.header-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #cdd6f4;
  letter-spacing: 0.3px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>

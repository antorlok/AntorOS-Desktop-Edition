<template>
  <div class="settings-section">
    <!-- TARJETA PRINCIPAL: PREVISUALIZACIÓN DE FONDO DE PANTALLA -->
    <SettingCard title="Fondo de pantalla" :icon="ImageIcon">
      <div class="wallpaper-preview-container">
        <!-- Fila 1: Miniatura y Navegación Secuencial -->
        <div class="preview-panel">
          <div class="thumbnail-wrapper">
            <img
              :src="configStore.wallpaper"
              alt="Miniatura de Fondo"
              class="thumbnail-img"
              :class="{ 'thumbnail-blurred': configStore.blurEnabled }"
            />
            <div class="thumbnail-overlay">
              <span class="preview-badge">VISTA PREVIA</span>
            </div>
          </div>

          <div class="navigation-controls">
            <span class="file-name">{{ currentWallpaperName }}</span>
            <div class="btn-group">
              <button
                type="button"
                class="nav-btn"
                @click="configStore.prevWallpaper"
                title="Fondo anterior"
              >
                <ChevronLeftIcon class="nav-icon" />
              </button>
              <button
                type="button"
                class="nav-btn"
                @click="configStore.nextWallpaper"
                title="Siguiente fondo"
              >
                <ChevronRightIcon class="nav-icon" />
              </button>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Fila 2: Rejilla de Selección Rápida de Imágenes del Sistema -->
        <div class="wallpaper-gallery-area">
          <span class="area-label">Galería de Imágenes del Sistema</span>
          <div class="gallery-grid">
            <button
              v-for="(img, index) in configStore.systemWallpapers"
              :key="img.name"
              type="button"
              class="gallery-card"
              :class="{ 'gallery-card-active': configStore.wallpaperIndex === index }"
              @click="configStore.wallpaperIndex = index"
              :title="img.name"
            >
              <img :src="img.dataUrl" class="gallery-thumb" />
              <span class="gallery-name">{{ img.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </SettingCard>

    <!-- TARJETAS DE OPCIONES / TOGGLES -->
    <SettingCard title="Opciones de Escritorio" :icon="SlidersIcon">
      <div class="setting-rows-list">
        <!-- Fila A: Fondos según modo -->
        <div class="setting-row">
          <div class="row-info">
            <span class="row-title">Fondos de pantalla según el modo</span>
            <span class="row-sub">Cambia automáticamente el fondo al activar el modo oscuro o claro.</span>
          </div>
          <ToggleSwitch v-model="modeSpecific" />
        </div>

        <div class="row-divider"></div>

        <!-- Fila B: Desenfocar fondo general -->
        <div class="setting-row">
          <div class="row-info">
            <span class="row-title">Desenfocar en la vista general</span>
            <span class="row-sub">Aplica un difuminado estético al fondo del escritorio al abrir aplicaciones.</span>
          </div>
          <ToggleSwitch v-model="configStore.blurEnabled" />
        </div>

        <div class="row-divider"></div>

        <!-- Fila C: Efecto de transición -->
        <div class="setting-row">
          <div class="row-info">
            <span class="row-title">Efecto de transición</span>
            <span class="row-sub">Animación al alternar entre diferentes fondos de pantalla.</span>
          </div>
          <div class="select-wrapper">
            <select v-model="transitionEffect" class="styled-select">
              <option value="fade">Disolver (Fade)</option>
              <option value="slide">Deslizar suave</option>
              <option value="zoom">Zoom holográfico</option>
              <option value="none">Ninguno</option>
            </select>
          </div>
        </div>
      </div>
    </SettingCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConfigStore } from '@/stores/configStore';
import SettingCard from '@/components/ui/SettingCard.vue';
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue';
import {
  Image as ImageIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Sliders as SlidersIcon
} from 'lucide-vue-next';

const configStore = useConfigStore();

// Estados Locales
const modeSpecific = ref(false);
const transitionEffect = ref('fade');

// Obtiene el nombre del archivo del fondo de pantalla actual de forma reactiva
const currentWallpaperName = computed(() => {
  const list = configStore.systemWallpapers;
  if (list.length === 0) return 'Sin imágenes';
  const idx = ((configStore.wallpaperIndex % list.length) + list.length) % list.length;
  return list[idx]?.name || 'Fondo_Desconocido.png';
});
</script>

<style scoped>
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.35s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Previsualización del Wallpaper */
.wallpaper-preview-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-panel {
  display: flex;
  gap: 20px;
  align-items: center;
}

.thumbnail-wrapper {
  width: 160px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: var(--glass-border);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.4s ease;
}

.thumbnail-blurred {
  filter: blur(5px) brightness(0.8);
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  pointer-events: none;
}

.preview-badge {
  font-family: monospace;
  font-size: 0.6rem;
  font-weight: bold;
  color: var(--neon-cyan);
  letter-spacing: 0.8px;
  text-shadow: var(--glow-cyan);
}

.navigation-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-name {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-family: monospace;
  word-break: break-all;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.nav-btn {
  background: var(--bg-primary);
  border: var(--glass-border);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: var(--neon-cyan);
  color: #11111b;
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.divider {
  height: 1px;
  background: var(--glass-border);
}

.area-label {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Rejilla de Selección Rápida de Imágenes */
.wallpaper-gallery-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
}

.gallery-card {
  background: var(--bg-primary);
  border: var(--glass-border);
  border-radius: 8px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.gallery-card:hover {
  border-color: var(--neon-cyan);
  transform: translateY(-2px);
  box-shadow: var(--glow-cyan);
}

.gallery-card-active {
  border-color: var(--neon-cyan) !important;
  box-shadow: var(--glow-cyan);
  background: rgba(0, 243, 255, 0.04);
}

.gallery-thumb {
  width: 100%;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
  border: var(--glass-border);
}

.gallery-name {
  font-size: 0.68rem;
  color: var(--text-secondary);
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-family: monospace;
}

.gallery-card-active .gallery-name {
  color: var(--neon-cyan);
  font-weight: 600;
}

/* Lista de filas de opciones */
.setting-rows-list {
  display: flex;
  flex-direction: column;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.row-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 16px;
}

.row-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
}

.row-sub {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.row-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 6px 0;
}

/* Selector estilizado nativo */
.select-wrapper {
  position: relative;
}

.styled-select {
  background: var(--bg-primary);
  border: var(--glass-border);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.8rem;
  padding: 6px 32px 6px 12px;
  outline: none;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s;
  min-width: 140px;
}

.styled-select:focus {
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.select-wrapper::after {
  content: '▼';
  font-size: 0.6rem;
  color: var(--text-secondary);
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
</style>

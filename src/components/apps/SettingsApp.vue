<template>
  <div class="settings-app-container">
    <!-- SIDEBAR DE NAVEGACIÓN (IZQUIERDA) -->
    <aside class="settings-sidebar">
      <!-- Perfil de Usuario Ficticio -->
      <div class="user-profile-card">
        <div class="avatar-glow">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
            alt="Avatar de antorlok"
            class="user-avatar"
          />
        </div>
        <div class="user-info">
          <span class="username">antorlok</span>
          <span class="user-role">Administrador del Sistema</span>
        </div>
      </div>

      <!-- Buscador Integrado Semi-Transparente -->
      <div class="search-box">
        <SearchIcon class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar ajustes..."
          class="search-input"
          spellcheck="false"
        />
      </div>

      <!-- Menú de Navegación por Categorías -->
      <nav class="categories-nav">
        <span class="menu-label">Personalización</span>
        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': activeTab === 'wallpaper' }"
          @click="activeTab = 'wallpaper'"
        >
          <ImageIcon class="nav-icon" />
          <span>Fondo de pantalla</span>
        </button>

        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': activeTab === 'theme' }"
          @click="activeTab = 'theme'"
        >
          <PaletteIcon class="nav-icon" />
          <span>Tema y colores</span>
        </button>

        <span class="menu-label">Dispositivo</span>
        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': activeTab === 'sounds' }"
          @click="activeTab = 'sounds'"
        >
          <Volume2Icon class="nav-icon" />
          <span>Sonidos</span>
        </button>
      </nav>
    </aside>

    <!-- ÁREA DE CONTENIDO DINÁMICO (DERECHA) -->
    <main class="settings-main-content">
      <!-- PESTAÑA: FONDO DE PANTALLA -->
      <div v-if="activeTab === 'wallpaper'">
        <h2 class="content-title">Personalizar Fondo</h2>
        <p class="content-sub">Elige un fondo de pantalla gamer y gestiona la apariencia del escritorio central.</p>
        <WallpaperSettings />
      </div>

      <!-- PLACEHOLDER PESTAÑA: TEMA Y COLORES -->
      <div v-else-if="activeTab === 'theme'" class="fallback-tab">
        <PaletteIcon class="fallback-icon" />
        <h3 class="fallback-title">Tema y Colores</h3>
        <p class="fallback-desc">El sistema opera en modo oscuro nativo ciber-futurista de alta densidad. Próximamente se integrarán paletas de colores HSL personalizadas.</p>
      </div>

      <!-- PLACEHOLDER PESTAÑA: SONIDOS -->
      <div v-else-if="activeTab === 'sounds'" class="fallback-tab">
        <Volume2Icon class="fallback-icon" />
        <h3 class="fallback-title">Panel de Audio</h3>
        <p class="fallback-desc">Gestión de alertas del Kernel, sonidos de notificaciones táctiles y volumen del sintetizador de audio.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Search as SearchIcon,
  Image as ImageIcon,
  Palette as PaletteIcon,
  Volume2 as Volume2Icon
} from 'lucide-vue-next';
import WallpaperSettings from '@/components/apps/settings/WallpaperSettings.vue';

// Estado Reactivo de Pestaña Activa
const activeTab = ref<'wallpaper' | 'theme' | 'sounds'>('wallpaper');
const searchQuery = ref('');
</script>

<style scoped>
.settings-app-container {
  display: flex;
  width: 100%;
  height: 100%;
  color: #cdd6f4;
  background-color: #11111b; /* Tema oscuro base Catppuccin */
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
  user-select: none;
}

/* SIDEBAR DE NAVEGACIÓN */
.settings-sidebar {
  width: 280px;
  background-color: #181825; /* Fondo del Sidebar ligeramente más claro */
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  gap: 20px;
}

/* Tarjeta de Perfil de Usuario */
.user-profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 10px;
}

.avatar-glow {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #e5c890, #f2d5cf);
  box-shadow: 0 0 10px rgba(229, 200, 144, 0.2);
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #1e1e2e;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 0.95rem;
  font-weight: bold;
  color: #cdd6f4;
}

.user-role {
  font-size: 0.7rem;
  color: #a6adc8;
}

/* Buscador */
.search-box {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #a6adc8;
}

.search-input {
  width: 100%;
  background: rgba(2, 6, 23, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 12px 8px 36px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.8rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #e5c890;
}

/* Navegación */
.categories-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-label {
  font-size: 0.7rem;
  font-weight: bold;
  color: #585b70;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 14px;
  margin-bottom: 6px;
  padding-left: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #a6adc8;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.02);
  color: #cdd6f4;
}

.nav-item-active {
  background: rgba(229, 200, 144, 0.15) !important;
  color: #e5c890 !important;
  font-weight: 600;
  box-shadow: inset 3px 0 0 #e5c890;
}

.nav-icon {
  width: 16px;
  height: 16px;
}

/* CONTENIDO PRINCIPAL (DERECHA) */
.settings-main-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  background-color: #1e1e2e; /* Contenido principal tiene fondo neutro oscuro */
}

.content-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}

.content-sub {
  font-size: 0.85rem;
  color: #a6adc8;
  margin-bottom: 24px;
}

/* Fallback de pestañas en desarrollo */
.fallback-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60%;
  text-align: center;
  padding: 40px;
  animation: fadeIn 0.3s ease-out;
}

.fallback-icon {
  width: 56px;
  height: 56px;
  color: rgba(229, 200, 144, 0.15);
  margin-bottom: 16px;
}

.fallback-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e5c890;
  margin-bottom: 8px;
}

.fallback-desc {
  font-size: 0.82rem;
  color: #a6adc8;
  max-width: 380px;
  line-height: 1.5;
}
</style>

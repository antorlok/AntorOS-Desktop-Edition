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

      <!-- PESTAÑA COMPLETA: TEMA Y COLORES -->
      <div v-else-if="activeTab === 'theme'">
        <h2 class="content-title">Tema y Colores</h2>
        <p class="content-sub">Elige el esquema de colores de la interfaz gráfica y los paneles del sistema.</p>
        <ThemeSettings />
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
import ThemeSettings from '@/components/apps/settings/ThemeSettings.vue';

// Estado Reactivo de Pestaña Activa
const activeTab = ref<'wallpaper' | 'theme' | 'sounds'>('wallpaper');
const searchQuery = ref('');
</script>

<style scoped>
.settings-app-container {
  display: flex;
  width: 100%;
  height: 100%;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
  user-select: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* SIDEBAR DE NAVEGACIÓN */
.settings-sidebar {
  width: 280px;
  background-color: var(--bg-secondary);
  border-right: var(--glass-border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  gap: 20px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Tarjeta de Perfil de Usuario */
.user-profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--glass-bg);
  border: var(--glass-border);
  padding: 12px;
  border-radius: 10px;
}

.avatar-glow {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta));
  box-shadow: var(--glow-cyan);
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: var(--bg-secondary);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 0.95rem;
  font-weight: bold;
  color: var(--text-primary);
}

.user-role {
  font-size: 0.7rem;
  color: var(--text-secondary);
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
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: 8px;
  padding: 8px 12px 8px 36px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.8rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
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
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 14px;
  margin-bottom: 6px;
  padding-left: 10px;
  opacity: 0.7;
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
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
}

.nav-item-active {
  background: rgba(0, 243, 255, 0.1) !important;
  color: var(--neon-cyan) !important;
  font-weight: 600;
  box-shadow: inset 3px 0 0 var(--neon-cyan);
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
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}

.content-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.content-sub {
  font-size: 0.85rem;
  color: var(--text-secondary);
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
  color: rgba(0, 243, 255, 0.15);
  margin-bottom: 16px;
}

.fallback-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--neon-cyan);
  margin-bottom: 8px;
}

.fallback-desc {
  font-size: 0.82rem;
  color: var(--text-secondary);
  max-width: 380px;
  line-height: 1.5;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

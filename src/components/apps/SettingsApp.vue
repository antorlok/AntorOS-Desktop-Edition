<template>
  <div class="settings-app-container">
    <!-- SIDEBAR DE NAVEGACIÓN (IZQUIERDA) -->
    <aside class="settings-sidebar">
      <!-- Perfil de Usuario Dinámico -->
      <div class="user-profile-card">
        <div class="avatar-glow">
          <img
            :src="userStore.avatarUrl"
            :alt="`Avatar de ${userStore.username}`"
            class="user-avatar"
          />
        </div>
        <div class="user-info">
          <span class="username">{{ userStore.username }}</span>
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
        <span class="menu-label">Sistema</span>
        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': configStore.settingsActiveTab === 'account' }"
          @click="configStore.settingsActiveTab = 'account'"
        >
          <UserIcon class="nav-icon" />
          <span>Cuenta de Usuario</span>
        </button>

        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': configStore.settingsActiveTab === 'about' }"
          @click="configStore.settingsActiveTab = 'about'"
        >
          <InfoIcon class="nav-icon" />
          <span>Información del Sistema</span>
        </button>

        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': configStore.settingsActiveTab === 'updates' }"
          @click="configStore.settingsActiveTab = 'updates'"
        >
          <RefreshCwIcon class="nav-icon" />
          <span>Actualización OTA</span>
        </button>

        <span class="menu-label">Personalización</span>
        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': configStore.settingsActiveTab === 'wallpaper' }"
          @click="configStore.settingsActiveTab = 'wallpaper'"
        >
          <ImageIcon class="nav-icon" />
          <span>Fondo de pantalla</span>
        </button>

        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': configStore.settingsActiveTab === 'theme' }"
          @click="configStore.settingsActiveTab = 'theme'"
        >
          <PaletteIcon class="nav-icon" />
          <span>Personalización</span>
        </button>

        <span class="menu-label">Dispositivo</span>
        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': configStore.settingsActiveTab === 'sounds' }"
          @click="configStore.settingsActiveTab = 'sounds'"
        >
          <Volume2Icon class="nav-icon" />
          <span>Sonidos</span>
        </button>

        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': configStore.settingsActiveTab === 'network' }"
          @click="configStore.settingsActiveTab = 'network'"
        >
          <WifiIcon class="nav-icon" />
          <span>Red Inalámbrica</span>
        </button>

        <button
          type="button"
          class="nav-item"
          :class="{ 'nav-item-active': configStore.settingsActiveTab === 'battery' }"
          @click="configStore.settingsActiveTab = 'battery'"
        >
          <BatteryIcon class="nav-icon" />
          <span>Batería y Brillo</span>
        </button>
      </nav>
    </aside>

    <!-- ÁREA DE CONTENIDO DINÁMICO (DERECHA) -->
    <main class="settings-main-content">
      <!-- PESTAÑA: CUENTA DE USUARIO -->
      <div v-if="configStore.settingsActiveTab === 'account'">
        <h2 class="content-title">Cuenta de Usuario</h2>
        <p class="content-sub">Administra tu perfil, avatar e información de seguridad del sistema.</p>
        <UserSettings />
      </div>

      <!-- PESTAÑA: INFORMACIÓN DEL SISTEMA -->
      <div v-else-if="configStore.settingsActiveTab === 'about'">
        <h2 class="content-title">Información del Sistema</h2>
        <p class="content-sub">Detalles acerca de la distribución Antor OS y especificaciones técnicas de la sesión.</p>
        <AboutSettings />
      </div>

      <!-- PESTAÑA: ACTUALIZACIÓN DE SOFTWARE -->
      <div v-else-if="configStore.settingsActiveTab === 'updates'">
        <h2 class="content-title">Actualización del Sistema</h2>
        <p class="content-sub">Busca e instala las últimas compilaciones OTA del núcleo de AntorOS de forma segura.</p>
        <UpdateSettings />
      </div>

      <!-- PESTAÑA: FONDO DE PANTALLA -->
      <div v-else-if="configStore.settingsActiveTab === 'wallpaper'">
        <h2 class="content-title">Personalizar Fondo</h2>
        <p class="content-sub">Elige un fondo de pantalla gamer y gestiona la apariencia del escritorio central.</p>
        <WallpaperSettings />
      </div>

      <!-- PESTAÑA COMPLETA: PERSONALIZACIÓN -->
      <div v-else-if="configStore.settingsActiveTab === 'theme'">
        <h2 class="content-title">Personalización</h2>
        <p class="content-sub">Elige el esquema de colores, efectos visuales y paneles del entorno del sistema.</p>
        <ThemeSettings />
      </div>

      <!-- PESTAÑA: SONIDOS -->
      <div v-else-if="configStore.settingsActiveTab === 'sounds'">
        <h2 class="content-title">Sonido del Sistema</h2>
        <p class="content-sub">Ajusta el volumen de reproducción y administra la salida de audio de la sesión.</p>
        <AudioSettings />
      </div>

      <!-- PESTAÑA: RED INALÁMBRICA -->
      <div v-else-if="configStore.settingsActiveTab === 'network'">
        <h2 class="content-title">Red Inalámbrica</h2>
        <p class="content-sub">Gestiona la interfaz de Wi-Fi virtual y conéctate a redes inalámbricas.</p>
        <NetworkSettings />
      </div>

      <!-- PESTAÑA: BATERÍA Y BRILLO -->
      <div v-else-if="configStore.settingsActiveTab === 'battery'">
        <h2 class="content-title">Batería y Brillo</h2>
        <p class="content-sub">Administra el brillo de la pantalla, ahorro de energía virtual y supervisa el consumo.</p>
        <BatterySettings />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Search as SearchIcon,
  User as UserIcon,
  Image as ImageIcon,
  Palette as PaletteIcon,
  Volume2 as Volume2Icon,
  Wifi as WifiIcon,
  Battery as BatteryIcon,
  Info as InfoIcon,
  RefreshCw as RefreshCwIcon
} from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';
import { useConfigStore } from '@/stores/configStore';
import WallpaperSettings from '@/components/apps/settings/WallpaperSettings.vue';
import ThemeSettings from '@/components/apps/settings/ThemeSettings.vue';
import UserSettings from '@/components/apps/settings/UserSettings.vue';
import AudioSettings from '@/components/apps/settings/AudioSettings.vue';
import NetworkSettings from '@/components/apps/settings/NetworkSettings.vue';
import BatterySettings from '@/components/apps/settings/BatterySettings.vue';
import AboutSettings from '@/components/apps/settings/AboutSettings.vue';
import UpdateSettings from '@/components/apps/settings/UpdateSettings.vue';

const userStore = useUserStore();
const configStore = useConfigStore();

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
  overflow-y: auto; /* Permite scroll vertical unificado en toda la barra lateral para evitar cortes en pantallas pequeñas */
  overflow-x: hidden;
  max-height: 100%;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Scrollbar ultra sutil para la barra lateral completa */
.settings-sidebar::-webkit-scrollbar {
  width: 4px;
}

.settings-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.settings-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
}

.settings-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
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
  flex-shrink: 0; /* Evita que se encoja cuando hay scroll */
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
  flex-shrink: 0; /* Evita que se encoja cuando hay scroll */
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
  flex-shrink: 0; /* Mantiene el tamaño natural de la lista de categorías dentro del scrollbar general */
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

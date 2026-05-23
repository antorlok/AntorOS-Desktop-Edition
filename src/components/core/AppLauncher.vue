<template>
  <Transition name="launcher-anim">
    <div
      v-if="osStore.isLauncherOpen"
      class="launcher-overlay"
      @click.self="closeLauncher"
    >
      <div class="launcher-dialog">
        <!-- Barra de Búsqueda Centralizada -->
        <div class="search-box">
          <SearchIcon class="search-icon" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar aplicación..."
            spellcheck="false"
            autocomplete="off"
            @keydown.escape="closeLauncher"
          />
        </div>

        <!-- Rejilla de Aplicaciones (App Grid) -->
        <div class="app-grid" role="navigation" aria-label="Aplicaciones de AntorUI">
          <button
            v-for="app in filteredApps"
            :key="app.id"
            class="app-card"
            @click="launchApp(app)"
          >
            <div class="app-icon-container">
              <component :is="app.icon" class="app-icon" />
              <div class="app-icon-glow"></div>
            </div>
            <span class="app-title">{{ app.title }}</span>
          </button>
          
          <!-- Estado vacío / Sin resultados -->
          <div v-if="filteredApps.length === 0" class="empty-state">
            Ninguna aplicación coincide con la búsqueda.
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { SYSTEM_APPS, type AppRegistryEntry } from '@/registry/apps';
import { Search as SearchIcon } from 'lucide-vue-next';

const osStore = useOSStore();
const searchQuery = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

// Filtrar las aplicaciones según el texto ingresado en el buscador
const filteredApps = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return SYSTEM_APPS;
  return SYSTEM_APPS.filter(
    (app) =>
      app.title.toLowerCase().includes(query) ||
      app.name.toLowerCase().includes(query)
  );
});

function closeLauncher() {
  osStore.isLauncherOpen = false;
  searchQuery.value = '';
}

function launchApp(app: AppRegistryEntry) {
  // openWindow ahora soporta recibir el objeto completo 'app' de forma directa y elegante
  osStore.openWindow(app);
  closeLauncher();
}

// Foco automático del buscador al abrir el menú de aplicaciones
watch(
  () => osStore.isLauncherOpen,
  async (isOpen) => {
    if (isOpen) {
      await nextTick();
      searchInputRef.value?.focus();
    } else {
      searchQuery.value = '';
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Contenedor Overlay a pantalla completa */
.launcher-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 12vh;
  z-index: 9999;
  pointer-events: auto;
  user-select: none;
}

.launcher-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 900px;
  gap: 48px;
  padding: 0 24px;
}

/* Buscador centralizado */
.search-box {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 500px;
  padding: 14px 24px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(34, 211, 238, 0.15);
  border-radius: 30px;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.6), 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-box:focus-within {
  border-color: #22d3ee;
  box-shadow: 
    0 0 20px rgba(34, 211, 238, 0.3),
    inset 0 0 8px rgba(34, 211, 238, 0.05);
  background: rgba(15, 23, 42, 0.7);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.35);
  transition: color 0.3s ease;
}

.search-box:focus-within .search-icon {
  color: #22d3ee;
  filter: drop-shadow(0 0 5px #22d3ee);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-family: inherit;
  font-size: 1.05rem;
  letter-spacing: 0.5px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* Grid de aplicaciones responsivo */
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 28px;
  width: 100%;
  justify-content: center;
  padding: 10px 0 40px 0;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

/* Scrollbar personalizada para la rejilla */
.app-grid::-webkit-scrollbar {
  width: 6px;
}
.app-grid::-webkit-scrollbar-track {
  background: transparent;
}
.app-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
.app-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.3);
}

/* Tarjeta de Aplicación individual */
.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 16px 8px;
  background: rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-card:hover {
  background: rgba(34, 211, 238, 0.04);
  border-color: rgba(34, 211, 238, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.app-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.25s ease;
}

.app-icon {
  width: 32px;
  height: 32px;
  transition: all 0.25s ease;
  z-index: 2;
}

.app-icon-glow {
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  background: radial-gradient(circle, #22d3ee 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 1;
}

/* Efectos de iluminaciones alternas: Cyan e Impar / Magenta y Par */
.app-card:hover .app-icon-container {
  border-color: #22d3ee;
  color: #22d3ee;
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.25);
}

.app-card:hover .app-icon {
  filter: drop-shadow(0 0 6px #22d3ee);
  transform: scale(1.05);
}

.app-card:hover .app-icon-glow {
  opacity: 0.2;
}

/* Variación Neón Magenta para tarjetas pares */
.app-card:nth-child(2n):hover {
  background: rgba(217, 70, 239, 0.04);
  border-color: rgba(217, 70, 239, 0.3);
}
.app-card:nth-child(2n):hover .app-icon-container {
  border-color: #d946ef;
  color: #d946ef;
  box-shadow: 0 0 15px rgba(217, 70, 239, 0.25);
}
.app-card:nth-child(2n):hover .app-icon {
  filter: drop-shadow(0 0 6px #d946ef);
}
.app-card:nth-child(2n):hover .app-icon-glow {
  background: radial-gradient(circle, #d946ef 0%, transparent 70%);
}

.app-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
  text-align: center;
  transition: color 0.25s ease;
}

.app-card:hover .app-title {
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.95rem;
  padding: 48px 0;
  letter-spacing: 0.5px;
}

/* ── ANIMACIONES DE TRANSICIÓN PREMIUM ── */
.launcher-anim-enter-active,
.launcher-anim-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.launcher-anim-enter-active .launcher-dialog {
  animation: scale-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.launcher-anim-leave-active .launcher-dialog {
  animation: scale-down 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.launcher-anim-enter-from,
.launcher-anim-leave-to {
  opacity: 0;
}

@keyframes scale-up {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes scale-down {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(15px);
  }
}
</style>

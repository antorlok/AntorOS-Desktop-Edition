<template>
  <div
    v-if="osStore.contextMenu.isOpen && osStore.contextMenu.app"
    ref="menuRef"
    class="custom-context-menu"
    :style="menuStyle"
    @click.stop
  >
    <!-- Opción 1: Abrir / Lanzar Ventana -->
    <button type="button" class="menu-item" @click="handleLaunch">
      <PlayIcon class="item-icon" />
      <span>Abrir aplicación</span>
    </button>

    <div class="menu-divider"></div>

    <!-- Opción 2: Anclar / Añadir al Dock -->
    <button
      v-if="!configStore.isAppPinned(osStore.contextMenu.app.id)"
      type="button"
      class="menu-item"
      @click="handlePin"
    >
      <PinIcon class="item-icon" />
      <span>Añadir al Dock</span>
    </button>

    <!-- Opción 3: Desanclar / Quitar del Dock -->
    <button
      v-else
      type="button"
      class="menu-item menu-item-danger"
      @click="handleUnpin"
    >
      <PinOffIcon class="item-icon" />
      <span>Quitar del Dock</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { useConfigStore } from '@/stores/configStore';
import { Play as PlayIcon, Pin as PinIcon, PinOff as PinOffIcon } from 'lucide-vue-next';

const osStore = useOSStore();
const configStore = useConfigStore();
const menuRef = ref<HTMLElement | null>(null);

// Coordenadas calculadas y corregidas para evitar desbordamiento del viewport (Edge Collision Detection)
const adjustedX = ref(0);
const adjustedY = ref(0);

// Watcher para recalcular la posición óptima del menú cuando se abre en los límites de la pantalla
watch(
  () => osStore.contextMenu.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await nextTick();
      if (!menuRef.value) return;

      const rect = menuRef.value.getBoundingClientRect();
      const menuWidth = rect.width || 180;
      const menuHeight = rect.height || 120;
      
      const clickX = osStore.contextMenu.x;
      const clickY = osStore.contextMenu.y;

      // Colisión derecha: si se desborda, lo empujamos a la izquierda del cursor
      if (clickX + menuWidth > window.innerWidth) {
        adjustedX.value = clickX - menuWidth;
      } else {
        adjustedX.value = clickX;
      }

      // Colisión inferior (Dock): si se desborda, lo empujamos hacia arriba del cursor
      if (clickY + menuHeight > window.innerHeight) {
        adjustedY.value = clickY - menuHeight;
      } else {
        adjustedY.value = clickY;
      }
    }
  }
);

const menuStyle = computed(() => {
  return {
    left: `${adjustedX.value}px`,
    top: `${adjustedY.value}px`
  };
});

// Acciones del Menú Contextual
function handleLaunch() {
  const app = osStore.contextMenu.app;
  if (app) {
    // Comprobar si ya se está ejecutando la ventana en el SO
    const runningApp = osStore.windows.find((w) => w.appName === app.name);
    if (runningApp) {
      osStore.focusWindow(runningApp.id);
    } else {
      osStore.openWindow(app);
    }
    // Cerrar el lanzador general si estuviera abierto para simular el OS real
    osStore.isLauncherOpen = false;
  }
  osStore.closeContextMenu();
}

function handlePin() {
  const app = osStore.contextMenu.app;
  if (app) {
    configStore.pinApp(app.id);
  }
  osStore.closeContextMenu();
}

function handleUnpin() {
  const app = osStore.contextMenu.app;
  if (app) {
    configStore.unpinApp(app.id);
  }
  osStore.closeContextMenu();
}

// Escucha de clicks fuera del menú y teclado para cerrar
function handleGlobalClick() {
  if (osStore.contextMenu.isOpen) {
    osStore.closeContextMenu();
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    osStore.closeContextMenu();
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
  window.addEventListener('contextmenu', handleGlobalClick); // Click derecho fuera cierra el menú anterior
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick);
  window.removeEventListener('contextmenu', handleGlobalClick);
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.custom-context-menu {
  position: fixed;
  z-index: 1000000; /* Siempre por encima de todo el workspace y overlays */
  width: 180px;
  background: rgba(17, 17, 27, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-color: rgba(0, 243, 255, 0.25);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5), 
    0 0 15px rgba(0, 243, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: contextMenuFade 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

@keyframes contextMenuFade {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* En el modo claro (inyectado por el contenedor padre .light-theme) */
:global(.light-theme) .custom-context-menu {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover {
  background: rgba(0, 243, 255, 0.1);
  color: var(--neon-cyan);
}

:global(.light-theme) .menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.menu-item-danger:hover {
  background: rgba(244, 63, 94, 0.15) !important;
  color: #f43f5e !important;
}

.item-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
}

.menu-item:hover .item-icon {
  transform: scale(1.08);
}

.menu-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 4px 0;
}

:global(.light-theme) .menu-divider {
  background: rgba(0, 0, 0, 0.08);
}
</style>

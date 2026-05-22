<template>
  <div
    v-show="!window.isMinimized"
    class="window-frame"
    :style="windowStyles"
    @mousedown="handleFocus"
  >
    <!-- Barra de Título -->
    <div class="title-bar" @mousedown="startDrag">
      <div class="title-text">{{ window.title }}</div>
      
      <!-- Controles de la Ventana -->
      <div class="window-controls" @mousedown.stop>
        <button class="ctrl-btn minimize" @click.stop="handleMinimize">_</button>
        <button class="ctrl-btn maximize" @click.stop="handleMaximize">[]</button>
        <button class="ctrl-btn close" @click.stop="handleClose">X</button>
      </div>
    </div>

    <!-- Contenido de la Aplicación (Slot) -->
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOSStore } from '@/stores/osStore';
import type { WindowProcess } from '@/types/os';
import { useWindowDrag } from '@/composables/useWindowDrag';

const props = defineProps<{
  window: WindowProcess;
}>();

const osStore = useOSStore();
const { startDrag } = useWindowDrag(props.window);

// Estilos dinámicos para posición y dimensiones absolutas
const windowStyles = computed(() => {
  // Si está maximizada, ocupa el 100% de la pantalla
  if (props.window.isMaximized) {
    return {
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%',
      zIndex: props.window.zIndex,
    };
  }

  return {
    top: `${props.window.position.y}px`,
    left: `${props.window.position.x}px`,
    width: `${props.window.dimensions.width}px`,
    height: `${props.window.dimensions.height}px`,
    zIndex: props.window.zIndex,
  };
});

// Traer la ventana al frente
function handleFocus() {
  osStore.focusWindow(props.window.id);
}

// Controladores de botones
function handleMinimize() {
  // Ocultar la ventana en el User Space (Pinia)
  osStore.minimizeWindow(props.window.id);
  // Opcional: Notificar a Electron si la ventana principal del OS debe minimizarse
  // window.osAPI.minimizeWindow();
}

function handleMaximize() {
  // Alternar maximizado en el User Space (Pinia)
  osStore.toggleMaximize(props.window.id);
  // Opcional: window.osAPI.maximizeWindow();
}

function handleClose() {
  // Cerrar el proceso en el User Space (Pinia)
  osStore.closeWindow(props.window.id);
  // NOTA: Si se desea que cerrar la última ventana cierre el OS completo:
  // window.osAPI.closeWindow(); 
}
</script>

<style scoped>
.window-frame {
  position: absolute;
  display: flex;
  flex-direction: column;
  
  /* Estilo Cristal (Glassmorphism) */
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  /* Bordes y Sombras Neón */
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  box-shadow: var(--glow-cyan);
  
  /* Transiciones suaves para maximizar/restaurar */
  transition: width 0.2s ease, height 0.2s ease, top 0.2s ease, left 0.2s ease;
  overflow: hidden;
}

/* Cambiar el color del glow al hacer focus (Opcional, mejora visual) */
.window-frame:focus-within {
  box-shadow: var(--glow-magenta);
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid var(--glass-border);
  padding: 0 12px;
  
  /* Usar no-drag para que los eventos de mouse de JS se ejecuten en la ventana virtual */
  -webkit-app-region: no-drag;
  user-select: none;
}

.title-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--neon-cyan);
  letter-spacing: 1px;
}

.window-controls {
  display: flex;
  gap: 8px;
  
  /* CRÍTICO: Evita que los clics en los botones arrastren la ventana */
  -webkit-app-region: no-drag;
}

.ctrl-btn {
  background: transparent;
  border: none;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.ctrl-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.ctrl-btn.close:hover {
  background: #ff3333;
  color: white;
  box-shadow: 0 0 10px rgba(255, 51, 51, 0.8);
}

.ctrl-btn.minimize:hover {
  color: var(--neon-cyan);
}

.ctrl-btn.maximize:hover {
  color: var(--neon-green);
}

.window-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  /* min-height:0 rompe el sizing intrínseco de flex para que el hijo
     (BrowserApp) no desborde sino que se contraiga al espacio disponible */
  min-height: 0;
  overflow: hidden;
}
</style>

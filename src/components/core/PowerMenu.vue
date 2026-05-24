<template>
  <div class="power-menu-dropdown" ref="dropdownRef" @click.stop>
    <!-- Opción A: Bloquear sesión -->
    <button type="button" class="power-item" @click="handleLock">
      <LockIcon class="item-icon accent-cyan" />
      <span class="item-label">Bloquear sesión</span>
    </button>

    <!-- Opción B: Reiniciar -->
    <button type="button" class="power-item" @click="handleRestart">
      <RotateCwIcon class="item-icon accent-green" />
      <span class="item-label">Reiniciar</span>
    </button>

    <div class="menu-divider"></div>

    <!-- Opción C: Apagar -->
    <button type="button" class="power-item power-item-danger" @click="handleShutdown">
      <PowerIcon class="item-icon accent-magenta" />
      <span class="item-label">Apagar</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { Lock as LockIcon, RotateCw as RotateCwIcon, Power as PowerIcon } from 'lucide-vue-next';

const osStore = useOSStore();
const dropdownRef = ref<HTMLElement | null>(null);

const emit = defineEmits(['close']);

// ---- Lógica de las Opciones ----

// 1. Apagar (Shutdown)
function handleShutdown() {
  emit('close');
  // Llamada IPC expuesta de forma segura en Electron
  if (window.osAPI && typeof window.osAPI.shutdown === 'function') {
    window.osAPI.shutdown();
  } else {
    // Fallback para pruebas en navegador estándar
    console.warn('[Power] Apagado invocado fuera del contenedor de Electron. Cerrando simulación.');
    alert('Apagado físico simulado. Sesión finalizada.');
  }
}

// 2. Reiniciar (Restart)
function handleRestart() {
  emit('close');
  
  // Establecer estado de reinicio/booteo activo
  osStore.isBooting = true;
  
  // Limpiar ventanas abiertas
  osStore.windows = [];
  
  // Detener todos los tracks físicos del micrófono en curso si la Grabadora estuviera activa
  // (Para robustez arquitectónica)
  try {
    const audioCtx = (window as any).audioContext;
    if (audioCtx) audioCtx.close();
  } catch (e) {}

  // Simular POST/Arranque de 5 segundos
  setTimeout(() => {
    osStore.isBooting = false;
    osStore.isAuthenticated = false; // Forzar bloqueo para el nuevo login
  }, 5000);
}

// 3. Bloquear (Lock)
function handleLock() {
  emit('close');
  osStore.isAuthenticated = false; // Desbloquear sesión redirige a LockScreen
}

// ---- Control de Cierre al Hacer Click Fuera ----
function handleOutsideClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    emit('close');
  }
}

onMounted(() => {
  // Retrasar el listener para evitar que el click de apertura lo cierre instantáneamente
  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick);
  }, 20);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.power-menu-dropdown {
  position: absolute;
  top: 36px;
  right: 10px;
  width: 190px;
  background: rgba(17, 17, 27, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-color: rgba(217, 70, 239, 0.25); /* Borde magenta neón sutil */
  border-radius: 12px;
  padding: 6px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5), 
    0 0 15px rgba(217, 70, 239, 0.15); /* Sombra brillante magenta neón */
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 1000000;
  animation: dropdownSlide 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

@keyframes dropdownSlide {
  from { opacity: 0; transform: translateY(-8px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* En el modo claro (inyectado por el contenedor padre .light-theme) */
:global(.light-theme) .power-menu-dropdown {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.05);
}

.power-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
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

.power-item:hover {
  background: rgba(217, 70, 239, 0.1);
  color: var(--neon-magenta);
}

:global(.light-theme) .power-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.power-item-danger:hover {
  background: rgba(244, 63, 94, 0.15) !important;
  color: #f43f5e !important;
}

.item-icon {
  width: 15px;
  height: 15px;
  transition: transform 0.2s ease;
}

.power-item:hover .item-icon {
  transform: scale(1.1);
}

/* Colores acentuados neón */
.accent-cyan {
  color: var(--neon-cyan);
}
.accent-green {
  color: var(--neon-green);
}
.accent-magenta {
  color: var(--neon-magenta);
}

.item-label {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  letter-spacing: 0.2px;
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

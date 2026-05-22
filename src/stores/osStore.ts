import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { WindowProcess, HardwareStats } from '@/types/os';

// Offset en cascada para cada nueva ventana
const CASCADE_OFFSET = 30;

export const useOSStore = defineStore('os', () => {
  // ---- State ----
  const windows = ref<WindowProcess[]>([]);
  const activeWindowId = ref<string | null>(null);
  const baseZIndex = ref(100);
  const stats = ref<HardwareStats>({ cpu_usage: 0, ram_usage: 0 });
  // Controla si el usuario superó la pantalla de bloqueo
  const isAuthenticated = ref(false);

  // ---- Getters ----
  const activeWindow = computed(() =>
    windows.value.find((w) => w.id === activeWindowId.value) ?? null,
  );

  const visibleWindows = computed(() =>
    windows.value.filter((w) => !w.isMinimized),
  );

  // ---- Actions ----

  /**
   * Registra un nuevo proceso de ventana.
   * Posiciona en cascada según el número de ventanas abiertas.
   */
  function openWindow(
    appName: string,
    title: string,
    defaultWidth: number = 800,
    defaultHeight: number = 500,
  ): string {
    const id = crypto.randomUUID();
    const cascade = windows.value.length;

    const process: WindowProcess = {
      id,
      appName,
      title,
      zIndex: baseZIndex.value++,
      isMinimized: false,
      isMaximized: false,
      position: {
        x: 80 + cascade * CASCADE_OFFSET,
        y: 60 + cascade * CASCADE_OFFSET,
      },
      dimensions: {
        width: defaultWidth,
        height: defaultHeight,
      },
    };

    windows.value.push(process);
    activeWindowId.value = id;

    return id;
  }

  /**
   * Trae una ventana al frente incrementando el baseZIndex global
   * y asignándoselo a la ventana seleccionada.
   */
  function focusWindow(id: string): void {
    const win = windows.value.find((w) => w.id === id);
    if (!win) return;

    if (win.isMinimized) {
      win.isMinimized = false;
    }

    win.zIndex = baseZIndex.value++;
    activeWindowId.value = id;
  }

  /** Elimina una ventana del array de procesos */
  function closeWindow(id: string): void {
    windows.value = windows.value.filter((w) => w.id !== id);

    // Re-activar la ventana visible con el zIndex más alto
    if (activeWindowId.value === id) {
      const topWindow = [...windows.value]
        .filter((w) => !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      activeWindowId.value = topWindow?.id ?? null;
    }
  }

  /** Actualiza las coordenadas de una ventana (Drag & Drop) */
  function updateWindowPosition(id: string, x: number, y: number): void {
    const win = windows.value.find((w) => w.id === id);
    if (!win) return;
    win.position.x = x;
    win.position.y = y;
  }

  /** Minimiza una ventana */
  function minimizeWindow(id: string): void {
    const win = windows.value.find((w) => w.id === id);
    if (!win) return;
    win.isMinimized = true;

    if (activeWindowId.value === id) {
      activeWindowId.value = null;
    }
  }

  /** Alterna el estado maximizado */
  function toggleMaximize(id: string): void {
    const win = windows.value.find((w) => w.id === id);
    if (!win) return;
    win.isMaximized = !win.isMaximized;
  }

  /** Actualiza las estadísticas de hardware desde el Kernel */
  function updateStats(incoming: HardwareStats): void {
    stats.value = incoming;
  }

  /** Autentica al usuario y desbloquea el escritorio */
  function unlock(): void {
    isAuthenticated.value = true;
  }

  return {
    // State
    windows,
    activeWindowId,
    baseZIndex,
    stats,
    isAuthenticated,
    // Getters
    activeWindow,
    visibleWindows,
    // Actions
    openWindow,
    focusWindow,
    closeWindow,
    updateWindowPosition,
    minimizeWindow,
    toggleMaximize,
    updateStats,
    unlock,
  };
});

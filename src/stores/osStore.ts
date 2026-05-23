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
  // Controla si el menú general de aplicaciones (App Grid) está visible
  const isLauncherOpen = ref(false);

  // ---- Sistema de Archivos Virtual Centralizado ----
  const fileSystem = ref<Record<string, { name: string; type: 'dir' | 'file'; size?: string; dataUrl?: string }[]>>({
    Inicio: [
      { name: 'Descargas', type: 'dir' },
      { name: 'Documentos', type: 'dir' },
      { name: 'Imágenes', type: 'dir' }
    ],
    Descargas: [
      { name: 'antor-os-v2.iso', type: 'file', size: '2.4 GB' },
      { name: 'config.json', type: 'file', size: '1.2 KB' }
    ],
    Documentos: [
      { name: 'proyecto-sistemas.pdf', type: 'file', size: '3.6 MB' },
      { name: 'bitacora-desarrollo.txt', type: 'file', size: '14 KB' },
      { name: 'antorui-arquitectura.docx', type: 'file', size: '512 KB' }
    ],
    Imágenes: [
      { name: 'neon-cityscape.png', type: 'file', size: '8.2 MB', dataUrl: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=1200' },
      { name: 'cyberpunk-avatar.jpg', type: 'file', size: '1.4 MB', dataUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200' },
      { name: 'desktop-mockup.png', type: 'file', size: '4.7 MB', dataUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200' }
    ]
  });

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
    appNameOrApp: string | { name: string; title: string; defaultWidth?: number; defaultHeight?: number },
    title?: string,
    defaultWidth?: number,
    defaultHeight?: number,
  ): string {
    let appName: string;
    let windowTitle: string;
    let width = 800;
    let height = 500;

    if (typeof appNameOrApp === 'object' && appNameOrApp !== null) {
      appName = appNameOrApp.name;
      windowTitle = appNameOrApp.title;
      width = appNameOrApp.defaultWidth ?? 800;
      height = appNameOrApp.defaultHeight ?? 500;
    } else {
      appName = appNameOrApp;
      windowTitle = title ?? '';
      width = defaultWidth ?? 800;
      height = defaultHeight ?? 500;
    }

    const id = crypto.randomUUID();
    const cascade = windows.value.length;

    const process: WindowProcess = {
      id,
      appName,
      title: windowTitle,
      zIndex: baseZIndex.value++,
      isMinimized: false,
      isMaximized: false,
      position: {
        x: 80 + cascade * CASCADE_OFFSET,
        y: 60 + cascade * CASCADE_OFFSET,
      },
      dimensions: {
        width,
        height,
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

  /** Alterna la visibilidad del launcher de aplicaciones */
  function toggleLauncher(): void {
    isLauncherOpen.value = !isLauncherOpen.value;
  }

  /** Inyecta un archivo nuevo dentro de un directorio específico */
  function addFileToFolder(folderName: string, file: { name: string; type: 'dir' | 'file'; size?: string; dataUrl?: string }): void {
    if (fileSystem.value[folderName]) {
      fileSystem.value[folderName].push(file);
    }
  }

  return {
    // State
    windows,
    activeWindowId,
    baseZIndex,
    stats,
    isAuthenticated,
    isLauncherOpen,
    fileSystem,
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
    toggleLauncher,
    addFileToFolder,
  };
});

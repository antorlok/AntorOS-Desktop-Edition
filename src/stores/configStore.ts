import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useOSStore } from '@/stores/osStore';

export const useConfigStore = defineStore('config', () => {
  const osStore = useOSStore();

  // ---- Estados ----
  // Recuperar el tema guardado en localStorage o usar 'dark' por defecto
  const savedTheme = localStorage.getItem('antorui-theme') as 'dark' | 'light';
  const theme = ref<'dark' | 'light'>(savedTheme || 'dark');
  
  // Recuperar el estado del Dock o habilitarlo por defecto (true)
  const savedDock = localStorage.getItem('antorui-dock-enabled');
  const dockEnabled = ref(savedDock === null ? true : savedDock === 'true');
  
  const wallpaperIndex = ref(0);
  const blurEnabled = ref(false);

  // --- Dock: Mostrar Métricas de Telemetría (Persistidas) ---
  const showDockCpu = ref(localStorage.getItem('antorui-dock-cpu') !== 'false');
  const showDockRam = ref(localStorage.getItem('antorui-dock-ram') !== 'false');
  const showDockTemp = ref(localStorage.getItem('antorui-dock-temp') !== 'false');

  // --- TopBar: Mostrar Métricas de Telemetría (Persistidas) ---
  const showTopbarCpu = ref(localStorage.getItem('antorui-topbar-cpu') !== 'false');
  const showTopbarRam = ref(localStorage.getItem('antorui-topbar-ram') !== 'false');
  const showTopbarTemp = ref(localStorage.getItem('antorui-topbar-temp') !== 'false');

  // --- Dock: Aplicaciones Ancladas Reactivas ---
  const savedPinned = localStorage.getItem('antorui-pinned-apps');
  const pinnedAppIds = ref<string[]>(
    savedPinned ? JSON.parse(savedPinned) : ['browser', 'terminal', 'settings', 'monitor', 'files']
  );

  // ---- Watchers reactivos en el Store ----
  watch(
    theme,
    (newTheme) => {
      localStorage.setItem('antorui-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    },
    { immediate: true }
  );

  watch(
    dockEnabled,
    (newVal) => {
      localStorage.setItem('antorui-dock-enabled', String(newVal));
    }
  );

  watch(
    pinnedAppIds,
    (newVal) => {
      localStorage.setItem('antorui-pinned-apps', JSON.stringify(newVal));
    },
    { deep: true }
  );

  watch(showDockCpu, (newVal) => {
    localStorage.setItem('antorui-dock-cpu', String(newVal));
  });

  watch(showDockRam, (newVal) => {
    localStorage.setItem('antorui-dock-ram', String(newVal));
  });

  watch(showDockTemp, (newVal) => {
    localStorage.setItem('antorui-dock-temp', String(newVal));
  });

  watch(showTopbarCpu, (newVal) => {
    localStorage.setItem('antorui-topbar-cpu', String(newVal));
  });

  watch(showTopbarRam, (newVal) => {
    localStorage.setItem('antorui-topbar-ram', String(newVal));
  });

  watch(showTopbarTemp, (newVal) => {
    localStorage.setItem('antorui-topbar-temp', String(newVal));
  });

  // ---- Getters ----
  // Retorna las imágenes cargadas en la carpeta virtual de Imágenes
  const systemWallpapers = computed(() => {
    return (osStore.fileSystem['Imágenes'] || []).filter(
      (file) => file.type === 'file' && file.dataUrl
    );
  });

  // Retorna la dataUrl del fondo seleccionado según el índice activo
  const wallpaper = computed(() => {
    const list = systemWallpapers.value;
    if (list.length === 0) return '';
    // Asegura que el índice esté dentro del rango dinámico
    const idx = ((wallpaperIndex.value % list.length) + list.length) % list.length;
    return list[idx]?.dataUrl || '';
  });

  // ---- Acciones ----
  function setTheme(newTheme: 'dark' | 'light') {
    theme.value = newTheme;
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  }

  function setWallpaper(url: string) {
    const idx = systemWallpapers.value.findIndex((img) => img.dataUrl === url);
    if (idx !== -1) {
      wallpaperIndex.value = idx;
    }
  }

  // Desenfocar fondo general
  function toggleBlur() {
    blurEnabled.value = !blurEnabled.value;
  }

  function nextWallpaper() {
    const len = systemWallpapers.value.length;
    if (len > 0) {
      wallpaperIndex.value = (wallpaperIndex.value + 1) % len;
    }
  }

  function prevWallpaper() {
    const len = systemWallpapers.value.length;
    if (len > 0) {
      wallpaperIndex.value = (wallpaperIndex.value - 1 + len) % len;
    }
  }

  // Acciones para Anclar / Desanclar del Dock
  function pinApp(appId: string) {
    if (!pinnedAppIds.value.includes(appId)) {
      pinnedAppIds.value.push(appId);
    }
  }

  function unpinApp(appId: string) {
    pinnedAppIds.value = pinnedAppIds.value.filter((id) => id !== appId);
  }

  function isAppPinned(appId: string): boolean {
    return pinnedAppIds.value.includes(appId);
  }

  return {
    theme,
    dockEnabled,
    wallpaperIndex,
    blurEnabled,
    systemWallpapers,
    wallpaper,
    pinnedAppIds,
    showDockCpu,
    showDockRam,
    showDockTemp,
    showTopbarCpu,
    showTopbarRam,
    showTopbarTemp,
    setTheme,
    toggleTheme,
    setWallpaper,
    toggleBlur,
    nextWallpaper,
    prevWallpaper,
    pinApp,
    unpinApp,
    isAppPinned
  };
});

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

  return {
    theme,
    dockEnabled,
    wallpaperIndex,
    blurEnabled,
    systemWallpapers,
    wallpaper,
    setTheme,
    toggleTheme,
    setWallpaper,
    toggleBlur,
    nextWallpaper,
    prevWallpaper
  };
});

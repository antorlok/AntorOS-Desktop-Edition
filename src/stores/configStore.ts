import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useOSStore } from '@/stores/osStore';

export const useConfigStore = defineStore('config', () => {
  const osStore = useOSStore();

  // ---- Estados ----
  const theme = ref<'dark' | 'light'>('dark');
  const wallpaperIndex = ref(0);
  const blurEnabled = ref(false);

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
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  function setWallpaper(url: string) {
    const idx = systemWallpapers.value.findIndex((img) => img.dataUrl === url);
    if (idx !== -1) {
      wallpaperIndex.value = idx;
    }
  }

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
    wallpaperIndex,
    blurEnabled,
    systemWallpapers,
    wallpaper,
    setTheme,
    setWallpaper,
    toggleBlur,
    nextWallpaper,
    prevWallpaper
  };
});

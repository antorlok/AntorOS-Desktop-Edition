import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useOSStore } from '@/stores/osStore';

export const useUpdateStore = defineStore('update', () => {
  const osStore = useOSStore();

  // ---- Estado Reactivo ----
  const currentVersion = ref<string>(
    localStorage.getItem('antorui-system-version') || 'v1.0.0'
  );
  const remoteVersion = ref<string | null>(null);
  const changelog = ref<string[]>([]);
  const isChecking = ref<boolean>(false);
  const isDownloading = ref<boolean>(false);
  const downloadProgress = ref<number>(0);

  /**
   * Simula la búsqueda de actualizaciones con un delay de 2 segundos.
   */
  function checkForUpdates(): Promise<void> {
    isChecking.value = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        isChecking.value = false;
        // Simulamos que se encuentra la versión v1.1.0
        remoteVersion.value = 'v1.1.0';
        changelog.value = [
          'Añadidos juegos retro: Cyber Toe (IA vs Bot y 1v1) y Neon Snake.',
          'Soporte completo para nombres de aplicaciones con espacios en el gestor antpac.',
          'Nueva interfaz de actualizaciones del sistema OTA.',
          'Optimizaciones internas del Kernel en Go y Gorilla WebSockets.'
        ];
        resolve();
      }, 2000);
    });
  }

  /**
   * Simula la descarga y aplicación de la actualización incrementando el progreso 
   * a lo largo de 5 segundos. Al finalizar, reinicia el sistema operativo.
   */
  function startUpdate(): void {
    if (isDownloading.value) return;
    isDownloading.value = true;
    downloadProgress.value = 0;

    const interval = setInterval(() => {
      downloadProgress.value += 10;
      if (downloadProgress.value >= 100) {
        clearInterval(interval);

        // Aplicar la actualización al llegar al 100%
        if (remoteVersion.value) {
          currentVersion.value = remoteVersion.value;
          localStorage.setItem('antorui-system-version', remoteVersion.value);
        }

        isDownloading.value = false;
        downloadProgress.value = 0;
        remoteVersion.value = null;
        changelog.value = [];

        // Forzar el reinicio completo del sistema operativo a través del osStore
        osStore.rebootSystem();
      }
    }, 500); // 10 ticks de 500ms = 5 segundos totales
  }

  return {
    currentVersion,
    remoteVersion,
    changelog,
    isChecking,
    isDownloading,
    downloadProgress,
    checkForUpdates,
    startUpdate
  };
});

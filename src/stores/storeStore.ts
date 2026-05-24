import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { SYSTEM_APPS } from '@/registry/apps';
import { useOSStore } from '@/stores/osStore';

export const useStoreStore = defineStore('store', () => {
  const osStore = useOSStore();

  // Inicializar apps instaladas por defecto con todas las que son isCore: true
  const coreAppIds = SYSTEM_APPS.filter((app) => app.isCore).map((app) => app.id);
  const savedInstalled = localStorage.getItem('antorui-installed-apps');
  
  // Estado: IDs de aplicaciones instaladas
  const installedAppIds = ref<string[]>(
    savedInstalled ? JSON.parse(savedInstalled) : [...coreAppIds]
  );

  // Watcher para persistencia automática
  watch(
    installedAppIds,
    (newVal) => {
      localStorage.setItem('antorui-installed-apps', JSON.stringify(newVal));
    },
    { deep: true }
  );

  // Getters
  // Aplicaciones disponibles para descargar (no instaladas)
  const availableApps = computed(() => {
    return SYSTEM_APPS.filter((app) => !installedAppIds.value.includes(app.id));
  });

  // Aplicaciones de terceros que pueden ser desinstaladas (instaladas y no son core)
  const removableApps = computed(() => {
    return SYSTEM_APPS.filter(
      (app) => installedAppIds.value.includes(app.id) && !app.isCore
    );
  });

  // Acciones
  function installApp(id: string) {
    if (!installedAppIds.value.includes(id)) {
      installedAppIds.value.push(id);
    }
  }

  function uninstallApp(id: string) {
    installedAppIds.value = installedAppIds.value.filter((appId) => appId !== id);

    // Cierre robusto: Cerrar cualquier ventana abierta asociada a esta app desinstalada
    const appEntry = SYSTEM_APPS.find((app) => app.id === id);
    if (appEntry) {
      const windowsToClose = osStore.windows.filter((w) => w.appName === appEntry.name);
      windowsToClose.forEach((win) => {
        osStore.closeWindow(win.id);
      });
    }
  }

  function isAppInstalled(id: string): boolean {
    return installedAppIds.value.includes(id);
  }

  return {
    installedAppIds,
    availableApps,
    removableApps,
    installApp,
    uninstallApp,
    isAppInstalled
  };
});

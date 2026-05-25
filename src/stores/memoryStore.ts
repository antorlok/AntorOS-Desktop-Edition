import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { SYSTEM_APPS } from '@/registry/apps';

// Constante física de memoria simulada (8GB en MB)
export const TOTAL_RAM = 8192;

export interface ProcessProfile {
  ram: number;       // en MB
  priority: number;  // 1 = Crítico (No matar), 2 = Media, 3 = Baja (Sacrificables)
}

// Mapa de perfiles de memoria estricta para cada aplicación
export const APP_MEMORY_MAP: Record<string, ProcessProfile> = {
  browser: { ram: 1200, priority: 2 },
  terminal: { ram: 150, priority: 1 },
  settings: { ram: 200, priority: 1 },
  monitor: { ram: 250, priority: 2 },
  files: { ram: 300, priority: 1 },
  notes: { ram: 180, priority: 3 },
  camera: { ram: 450, priority: 2 },
  network: { ram: 160, priority: 3 },
  office: { ram: 600, priority: 2 },
  calculator: { ram: 100, priority: 3 },
  calendar: { ram: 120, priority: 3 },
  clock: { ram: 80, priority: 3 },
  recorder: { ram: 220, priority: 3 },
  store: { ram: 400, priority: 2 },
  neonplayer: { ram: 350, priority: 3 },
  cybercode: { ram: 500, priority: 2 },
  sysbench: { ram: 900, priority: 2 },
  tictactoe: { ram: 300, priority: 3 },
  snake: { ram: 250, priority: 3 },
  tetris: { ram: 280, priority: 3 }
};

interface ActiveProcess {
  pid: string;
  appId: string;
  ram: number;
  priority: number;
}

export const useMemoryStore = defineStore('memory', () => {
  // ---- Estado Reactivo ----
  const activeProcesses = ref<ActiveProcess[]>([]);

  // ---- Getters ----
  const usedRAM = computed(() => {
    return activeProcesses.value.reduce((sum, p) => sum + p.ram, 0);
  });

  const freeRAM = computed(() => {
    return TOTAL_RAM - usedRAM.value;
  });

  const ramPercentage = computed(() => {
    return (usedRAM.value / TOTAL_RAM) * 100;
  });

  // ---- Acciones ----

  /**
   * Registra el consumo del proceso en la tabla activa.
   */
  function allocateMemory(appId: string, pid: string) {
    const profile = APP_MEMORY_MAP[appId] || { ram: 200, priority: 3 };
    activeProcesses.value.push({
      pid,
      appId,
      ram: profile.ram,
      priority: profile.priority
    });
  }

  /**
   * Libera la memoria registrada de un proceso por su ID único de ventana.
   */
  function freeMemory(pid: string) {
    activeProcesses.value = activeProcesses.value.filter((p) => p.pid !== pid);
  }

  /**
   * Algoritmo OOM (Out of Memory) Killer.
   * Si no hay espacio, busca procesos de prioridad baja, los ordena por consumo y los cierra.
   * Retorna true si hay suficiente memoria (con o sin matanzas), false si no se puede alocar.
   */
  function requestMemoryAllocation(appId: string): boolean {
    const profile = APP_MEMORY_MAP[appId] || { ram: 200, priority: 3 };
    const required = profile.ram;

    // 1. Hay memoria libre suficiente
    if (freeRAM.value >= required) {
      return true;
    }

    // 2. Ejecutar OOM Killer
    const osStore = useOSStore();

    // Recorrer de prioridades bajas (3) a medias (2). NUNCA tocar la 1 (procesos esenciales)
    for (let pLevel = 3; pLevel >= 2; pLevel--) {
      // Filtrar candidatos y ordenarlos de mayor consumo a menor
      const candidates = activeProcesses.value
        .filter((p) => p.priority === pLevel)
        .sort((a, b) => b.ram - a.ram);

      for (const process of candidates) {
        const appEntry = SYSTEM_APPS.find((app) => app.id === process.appId);
        const title = appEntry ? appEntry.title : process.appId;

        console.warn(`[OOM Killer] Sacrificando proceso: ${title} (${process.pid}) para liberar ${process.ram} MB.`);
        
        // Cerrar ventana del OS. Esto llamará automáticamente a freeMemory(process.pid) en cadena
        osStore.closeWindow(process.pid);

        // Si se liberó suficiente espacio, retornar éxito
        if (freeRAM.value >= required) {
          return true;
        }
      }
    }

    // Si aún con las matanzas no alcanza (u OOM total), denegar alocación
    return false;
  }

  return {
    activeProcesses,
    usedRAM,
    freeRAM,
    ramPercentage,
    allocateMemory,
    freeMemory,
    requestMemoryAllocation
  };
});

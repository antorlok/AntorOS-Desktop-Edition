<template>
  <div class="monitor-container">
    <!-- Sidebar izquierdo -->
    <aside class="monitor-sidebar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="sidebar-tab-btn"
        :class="{ 'active-tab': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="tab-icon" />
        <span class="tab-text">{{ tab.label }}</span>
      </button>
    </aside>

    <!-- Panel de contenido principal -->
    <main class="monitor-main-content">
      <!-- PESTAÑA: RECURSOS -->
      <section v-if="activeTab === 'recursos'" class="monitor-section recursos-tab">
        <h2 class="section-title">Rendimiento de Recursos</h2>
        
        <div class="metrics-grid">
          <!-- CPU Card -->
          <div class="metric-card cpu-card">
            <h3 class="metric-title">Procesador (CPU)</h3>
            <div class="radial-container">
              <svg class="radial-svg" viewBox="0 0 100 100">
                <circle class="radial-bg" cx="50" cy="50" r="40" />
                <circle
                  class="radial-fill cpu-fill"
                  cx="50"
                  cy="50"
                  r="40"
                  stroke-dasharray="251.2"
                  :stroke-dashoffset="calculateOffset(osStore.stats.cpu_usage)"
                />
              </svg>
              <div class="radial-label cpu-label">
                <span class="value-text">{{ Math.round(osStore.stats.cpu_usage) }}%</span>
                <span class="sub-text">Carga</span>
              </div>
            </div>
            <div class="metric-details">
              <span>Frecuencia: 3.8 GHz</span>
              <span>Núcleos activos: 8 / 8</span>
            </div>
          </div>

          <!-- RAM Card -->
          <div class="metric-card ram-card">
            <h3 class="metric-title">Memoria (RAM)</h3>
            <div class="radial-container">
              <svg class="radial-svg" viewBox="0 0 100 100">
                <circle class="radial-bg" cx="50" cy="50" r="40" />
                <circle
                  class="radial-fill ram-fill"
                  cx="50"
                  cy="50"
                  r="40"
                  stroke-dasharray="251.2"
                  :stroke-dashoffset="calculateOffset(memoryStore.ramPercentage)"
                />
              </svg>
              <div class="radial-label ram-label">
                <span class="value-text">{{ Math.round(memoryStore.ramPercentage) }}%</span>
                <span class="sub-text">Uso</span>
              </div>
            </div>
            <div class="metric-details">
              <span>Total: 8.0 GB</span>
              <span>En uso: {{ (memoryStore.usedRAM / 1024).toFixed(1) }} GB</span>
            </div>
          </div>
        </div>
      </section>

      <!-- PESTAÑA: PROCESOS -->
      <section v-else-if="activeTab === 'procesos'" class="monitor-section procesos-tab">
        <h2 class="section-title">Procesos en Ejecución</h2>
        
        <div class="table-wrapper">
          <table class="processes-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Proceso</th>
                <th>CPU</th>
                <th>Memoria (RAM)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="proc in processes" :key="proc.pid">
                <td class="proc-pid">#{{ proc.pid }}</td>
                <td class="proc-name">
                  <TerminalIcon class="proc-icon" />
                  {{ proc.name }}
                </td>
                <td class="proc-cpu" :class="{ 'high-usage': proc.cpu > 20 }">
                  {{ proc.cpu.toFixed(1) }}%
                </td>
                <td class="proc-ram">{{ proc.ram.toFixed(1) }} MB</td>
                <td class="proc-status">
                  <span class="status-badge status-active">Activo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- PESTAÑA: DISCO -->
      <section v-else-if="activeTab === 'disco'" class="monitor-section disco-tab">
        <h2 class="section-title">Almacenamiento de Disco</h2>
        
        <div class="disk-card">
          <div class="disk-info">
            <div class="disk-meta">
              <HardDriveIcon class="disk-icon" />
              <div>
                <h3 class="disk-name">Unidad Principal (SSD)</h3>
                <span class="disk-path">Montado en: /root</span>
              </div>
            </div>
            <span class="disk-numbers">256.0 GB / 512.0 GB Usados</span>
          </div>

          <div class="progress-container">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill disk-fill" style="width: 50%"></div>
            </div>
            <div class="progress-labels">
              <span>50% Usado</span>
              <span>256.0 GB Libres</span>
            </div>
          </div>

          <div class="disk-grid">
            <div class="disk-stat-box">
              <span class="box-label">Lectura</span>
              <span class="box-value read-glow">420 MB/s</span>
            </div>
            <div class="disk-stat-box">
              <span class="box-label">Escritura</span>
              <span class="box-value write-glow">380 MB/s</span>
            </div>
            <div class="disk-stat-box">
              <span class="box-label">Formato</span>
              <span class="box-value">ext4-cyber</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useOSStore } from '@/stores/osStore';
import { useMemoryStore } from '@/stores/memoryStore';
import { Cpu as CpuIcon, Layers as LayersIcon, HardDrive as HardDriveIcon, Terminal as TerminalIcon } from 'lucide-vue-next';

const osStore = useOSStore();
const memoryStore = useMemoryStore();
const activeTab = ref('recursos');

// Definición de pestañas
const tabs = [
  { id: 'recursos', label: 'Recursos', icon: CpuIcon },
  { id: 'procesos', label: 'Procesos', icon: TerminalIcon },
  { id: 'disco', label: 'Disco', icon: HardDriveIcon }
];

// Cálculo de circunferencia SVG (Circunferencia = 2 * PI * r)
// Para r = 40, Circunferencia = 251.2
const calculateOffset = (percentage: number) => {
  const cleanPercent = Math.max(0, Math.min(100, percentage));
  return 251.2 - (251.2 * cleanPercent) / 100;
};

// Métricas de recursos de los procesos fijos de fondo del sistema
const baseProcMetrics = ref({
  goDaemonCpu: 1.2,
  goDaemonRam: 42.5,
  electronCpu: 4.8,
  electronRam: 128.4,
  vueCpu: 2.1,
  vueRam: 89.2,
  kernelCpu: 0.5,
  kernelRam: 16.1,
  compositorCpu: 3.5,
  compositorRam: 74.0
});

// Registro reactivo de recursos de ventanas virtuales activas
const windowMetrics = ref<Record<string, { cpu: number; ram: number }>>({});

// Lista de procesos que combinan los fijos del sistema y las ventanas del osStore
const processes = computed(() => {
  const list = [
    { pid: 1402, name: 'go-daemon', cpu: baseProcMetrics.value.goDaemonCpu, ram: baseProcMetrics.value.goDaemonRam },
    { pid: 2195, name: 'electron-shell', cpu: baseProcMetrics.value.electronCpu, ram: baseProcMetrics.value.electronRam },
    { pid: 3108, name: 'vue-dev-server', cpu: baseProcMetrics.value.vueCpu, ram: baseProcMetrics.value.vueRam },
    { pid: 884,  name: 'antor-kernel', cpu: baseProcMetrics.value.kernelCpu, ram: baseProcMetrics.value.kernelRam },
    { pid: 4210, name: 'cyber-compositor', cpu: baseProcMetrics.value.compositorCpu, ram: baseProcMetrics.value.compositorRam }
  ];

  // Agregar dinámicamente las ventanas reales abiertas con su consumo exacto de memoryStore
  osStore.windows.forEach((win) => {
    // Creamos un PID determinista a partir de los caracteres del id
    const hash = win.id.split('-').reduce((acc, part) => acc + parseInt(part, 16) || 0, 0);
    const pid = 5000 + (Math.abs(hash) % 4000);
    
    // Obtenemos o creamos métricas dinámicas para esta ventana
    if (!windowMetrics.value[win.id]) {
      windowMetrics.value[win.id] = {
        cpu: 1.0 + Math.random() * 3.0,
        ram: 0 // Se leerá del memoryStore
      };
    }

    const memProc = memoryStore.activeProcesses.find((p) => p.pid === win.id);
    const ramConsumption = memProc ? memProc.ram : 200;
    
    list.push({
      pid,
      name: `${win.title} (${win.appName})`,
      cpu: windowMetrics.value[win.id].cpu,
      ram: ramConsumption
    });
  });

  return list;
});

let updateInterval: ReturnType<typeof setInterval>;

// Simulación de fluctuaciones dinámicas en los procesos
function simulateProcesses() {
  // Fluctuar procesos base de fondo
  baseProcMetrics.value.goDaemonCpu = Math.max(0.1, baseProcMetrics.value.goDaemonCpu + (Math.random() - 0.5) * 0.4);
  baseProcMetrics.value.goDaemonRam = Math.max(10, baseProcMetrics.value.goDaemonRam + (Math.random() - 0.5) * 0.8);
  
  baseProcMetrics.value.electronCpu = Math.max(0.5, baseProcMetrics.value.electronCpu + (Math.random() - 0.5) * 0.9);
  baseProcMetrics.value.electronRam = Math.max(30, baseProcMetrics.value.electronRam + (Math.random() - 0.5) * 1.5);
  
  baseProcMetrics.value.vueCpu = Math.max(0.2, baseProcMetrics.value.vueCpu + (Math.random() - 0.5) * 0.6);
  baseProcMetrics.value.vueRam = Math.max(20, baseProcMetrics.value.vueRam + (Math.random() - 0.5) * 1.2);
  
  baseProcMetrics.value.kernelCpu = Math.max(0.1, baseProcMetrics.value.kernelCpu + (Math.random() - 0.5) * 0.2);
  baseProcMetrics.value.kernelRam = Math.max(5, baseProcMetrics.value.kernelRam + (Math.random() - 0.5) * 0.3);
  
  baseProcMetrics.value.compositorCpu = Math.max(0.5, baseProcMetrics.value.compositorCpu + (Math.random() - 0.5) * 0.8);
  baseProcMetrics.value.compositorRam = Math.max(25, baseProcMetrics.value.compositorRam + (Math.random() - 0.5) * 1.0);

  // Fluctuar y depurar métricas de ventanas reales abiertas
  const currentIds = osStore.windows.map(w => w.id);
  
  // Limpieza de métricas de ventanas cerradas para evitar fugas de memoria
  Object.keys(windowMetrics.value).forEach((id) => {
    if (!currentIds.includes(id)) {
      delete windowMetrics.value[id];
    }
  });

  // Fluctuar métricas de ventanas vivas
  currentIds.forEach((id) => {
    if (windowMetrics.value[id]) {
      const deltaCpu = (Math.random() - 0.5) * 1.2;
      windowMetrics.value[id].cpu = Math.max(0.2, windowMetrics.value[id].cpu + deltaCpu);

      const deltaRam = (Math.random() - 0.5) * 2.5;
      windowMetrics.value[id].ram = Math.max(10, windowMetrics.value[id].ram + deltaRam);
    }
  });
}

onMounted(() => {
  updateInterval = setInterval(simulateProcesses, 1500);
});

onUnmounted(() => {
  clearInterval(updateInterval);
});
</script>

<style scoped>
.monitor-container {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(10, 15, 30, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

/* Sidebar Estilo Cyber */
.monitor-sidebar {
  width: 180px;
  background: rgba(2, 6, 23, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  gap: 8px;
}

.sidebar-tab-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-tab-btn:hover {
  background: rgba(34, 211, 238, 0.05);
  color: #22d3ee;
}

.active-tab {
  background: rgba(34, 211, 238, 0.1) !important;
  color: #22d3ee !important;
  border-color: rgba(34, 211, 238, 0.3) !important;
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.1);
}

.tab-icon {
  width: 18px;
  height: 18px;
}

/* Contenido Principal */
.monitor-main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.monitor-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 10px;
}

/* Pestaña: Recursos */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.metric-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.metric-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  width: 100%;
  text-align: left;
}

/* Gráficos Radiales SVG */
.radial-container {
  position: relative;
  width: 140px;
  height: 140px;
}

.radial-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.radial-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 8px;
}

.radial-fill {
  fill: none;
  stroke-width: 8px;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.cpu-fill {
  stroke: #22d3ee;
  filter: drop-shadow(0 0 4px #22d3ee);
}

.ram-fill {
  stroke: #d946ef;
  filter: drop-shadow(0 0 4px #d946ef);
}

.radial-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.value-text {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.6rem;
  font-weight: bold;
  color: #ffffff;
}

.cpu-label .value-text {
  text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
}

.ram-label .value-text {
  text-shadow: 0 0 10px rgba(217, 70, 239, 0.5);
}

.sub-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 12px;
}

/* Pestaña: Procesos */
.table-wrapper {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.processes-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}

.processes-table th {
  background: rgba(2, 6, 23, 0.3);
  padding: 12px 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.processes-table td {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.processes-table tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.proc-pid {
  font-family: monospace;
  color: rgba(255, 255, 255, 0.4);
}

.proc-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.proc-icon {
  width: 14px;
  height: 14px;
  color: #22d3ee;
}

.proc-cpu {
  font-family: monospace;
  font-weight: 600;
}

.proc-cpu.high-usage {
  color: #f43f5e;
  text-shadow: 0 0 6px rgba(244, 63, 94, 0.4);
}

.proc-ram {
  font-family: monospace;
}

.status-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background: rgba(34, 211, 238, 0.1);
  color: #22d3ee;
  border: 1px solid rgba(34, 211, 238, 0.2);
}

/* Pestaña: Disco */
.disk-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.disk-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.disk-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.disk-icon {
  width: 32px;
  height: 32px;
  color: #d946ef;
  filter: drop-shadow(0 0 6px #d946ef);
}

.disk-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
}

.disk-path {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

.disk-numbers {
  font-family: monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

/* Barra de Progreso Neón */
.progress-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.disk-fill {
  background: #d946ef;
  box-shadow: 0 0 10px #d946ef;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Cuadrícula de Stats */
.disk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.disk-stat-box {
  background: rgba(2, 6, 23, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.box-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}

.box-value {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffffff;
}

.read-glow {
  color: #22d3ee;
  text-shadow: 0 0 6px rgba(34, 211, 238, 0.4);
}

.write-glow {
  color: #d946ef;
  text-shadow: 0 0 6px rgba(217, 70, 239, 0.4);
}
</style>

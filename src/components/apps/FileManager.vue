<template>
  <div class="explorer-container">
    <!-- Barra superior de navegación / dirección -->
    <header class="explorer-header">
      <div class="nav-controls">
        <button
          class="nav-btn"
          :disabled="currentPath === 'Inicio'"
          @click="goBack"
          title="Subir de nivel"
        >
          <ArrowLeftIcon class="control-icon" />
        </button>
      </div>

      <!-- Barra de ruta / migas de pan -->
      <div class="breadcrumb-bar" role="navigation" aria-label="Ruta de archivos">
        <span class="root-crumb">Sistema</span>
        <span class="crumb-separator">/</span>
        <span
          class="crumb-link"
          :class="{ 'active-crumb': currentPath === 'Inicio' }"
          @click="currentPath = 'Inicio'"
        >
          Inicio
        </span>
        <template v-if="currentPath !== 'Inicio'">
          <span class="crumb-separator">/</span>
          <span class="crumb-link active-crumb">{{ currentPath }}</span>
        </template>
      </div>
    </header>

    <div class="explorer-body">
      <!-- Sidebar izquierdo (GNOME Nautilus Style) -->
      <aside class="explorer-sidebar">
        <button
          v-for="dest in destinations"
          :key="dest.id"
          class="sidebar-dest-btn"
          :class="{ 'active-dest': currentPath === dest.id }"
          @click="currentPath = dest.id"
        >
          <component :is="dest.icon" class="dest-icon" />
          <span class="dest-text">{{ dest.label }}</span>
        </button>
      </aside>

      <!-- Panel principal (Grid de archivos) -->
      <main class="explorer-main-view">
        <div class="files-grid">
          <div
            v-for="item in currentFiles"
            :key="item.name"
            class="grid-item"
            :class="{ 'item-dir': item.type === 'dir', 'item-file': item.type === 'file' }"
            @dblclick="handleItemAction(item)"
            @click="selectedItemName = item.name"
            :aria-selected="selectedItemName === item.name"
            role="button"
            tabindex="0"
          >
            <!-- Icono según tipo de archivo -->
            <div class="item-icon-wrapper">
              <FolderIcon v-if="item.type === 'dir'" class="item-icon folder-icon" />
              <component :is="getFileIcon(item.name)" v-else class="item-icon file-icon" />
            </div>

            <!-- Nombre y detalles -->
            <span class="item-name" :title="item.name">{{ item.name }}</span>
            <span v-if="item.size" class="item-size">{{ item.size }}</span>
          </div>

          <!-- Carpeta vacía fallback -->
          <div v-if="currentFiles.length === 0" class="empty-folder-state">
            Carpeta vacía
          </div>
        </div>
      </main>
    </div>

    <!-- Barra de estado inferior -->
    <footer class="explorer-footer">
      <span>{{ currentFiles.length }} elementos en esta carpeta</span>
      <span v-if="selectedItemName" class="selection-status">Seleccionado: {{ selectedItemName }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Folder as FolderIcon,
  File as FileIcon,
  FileText as FileTextIcon,
  Image as ImageIcon,
  ArrowLeft as ArrowLeftIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
  BookOpen as BookOpenIcon,
  Check as CheckIcon
} from 'lucide-vue-next';

// Ruta interna actual
const currentPath = ref('Inicio');
const selectedItemName = ref<string | null>(null);

// Destinos rápidos del sidebar
const destinations = [
  { id: 'Inicio', label: 'Inicio', icon: HomeIcon },
  { id: 'Descargas', label: 'Descargas', icon: DownloadIcon },
  { id: 'Documentos', label: 'Documentos', icon: BookOpenIcon },
  { id: 'Imágenes', label: 'Imágenes', icon: ImageIcon }
];

interface FileItem {
  name: string;
  type: 'dir' | 'file';
  size?: string;
}

// Representación en memoria de la jerarquía de carpetas y archivos simulada (DRY y limpia)
const mockFileSystem: Record<string, FileItem[]> = {
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
    { name: 'neon-cityscape.png', type: 'file', size: '8.2 MB' },
    { name: 'cyberpunk-avatar.jpg', type: 'file', size: '1.4 MB' },
    { name: 'desktop-mockup.png', type: 'file', size: '4.7 MB' }
  ]
};

// Computado de archivos de la ruta actual
const currentFiles = computed(() => {
  return mockFileSystem[currentPath.value] || [];
});

// Selector de iconos según la extensión del archivo
function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'txt':
    case 'json':
      return FileTextIcon;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return ImageIcon;
    default:
      return FileIcon;
  }
}

// Retroceder de nivel
function goBack() {
  if (currentPath.value !== 'Inicio') {
    currentPath.value = 'Inicio';
    selectedItemName.value = null;
  }
}

// Acciones sobre archivos / doble click
function handleItemAction(item: FileItem) {
  selectedItemName.value = null;
  if (item.type === 'dir') {
    // Entrar a la carpeta
    currentPath.value = item.name;
  } else {
    // Abrir un archivo (simulación Cyberpunk)
    alert(`Ejecutando acción virtual sobre archivo: ${item.name}`);
  }
}
</script>

<style scoped>
.explorer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(10, 15, 30, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

/* Barra Superior Navegación */
.explorer-header {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 48px;
  padding: 0 16px;
  background: rgba(2, 6, 23, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-controls {
  display: flex;
  align-items: center;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(34, 211, 238, 0.1);
  border-color: rgba(34, 211, 238, 0.3);
  color: #22d3ee;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-icon {
  width: 16px;
  height: 16px;
}

/* Migas de Pan / Breadcrumbs */
.breadcrumb-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.root-crumb {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.crumb-separator {
  color: rgba(255, 255, 255, 0.2);
}

.crumb-link {
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
}

.crumb-link:hover {
  color: #22d3ee;
}

.active-crumb {
  color: #22d3ee;
  font-weight: 600;
  text-shadow: 0 0 6px rgba(34, 211, 238, 0.3);
}

/* Cuerpo Principal */
.explorer-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar GNOME Nautilus Style */
.explorer-sidebar {
  width: 170px;
  background: rgba(2, 6, 23, 0.35);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  gap: 6px;
}

.sidebar-dest-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.65);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-dest-btn:hover {
  background: rgba(34, 211, 238, 0.05);
  color: #22d3ee;
}

.active-dest {
  background: rgba(34, 211, 238, 0.08) !important;
  color: #22d3ee !important;
  border-color: rgba(34, 211, 238, 0.2) !important;
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.25);
}

.dest-icon {
  width: 16px;
  height: 16px;
}

/* Vista principal de Archivos */
.explorer-main-view {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 20px;
}

/* Item de la Rejilla */
.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 6px;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.grid-item:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);
}

.grid-item:focus,
.grid-item[aria-selected="true"] {
  background: rgba(34, 211, 238, 0.08);
  border-color: rgba(34, 211, 238, 0.25);
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.05);
}

.item-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.item-icon {
  width: 38px;
  height: 38px;
  transition: transform 0.2s ease;
}

.grid-item:hover .item-icon {
  transform: scale(1.05);
}

.folder-icon {
  color: #38bdf8;
  filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.3));
}

.file-icon {
  color: #cbd5e1;
}

.item-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.grid-item[aria-selected="true"] .item-name {
  color: #22d3ee;
  font-weight: 500;
}

.item-size {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.empty-folder-state {
  grid-column: 1 / -1;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.85rem;
  padding: 40px 0;
}

/* Footer Barra de Estado */
.explorer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  padding: 0 16px;
  background: rgba(2, 6, 23, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

.selection-status {
  color: #22d3ee;
}
</style>

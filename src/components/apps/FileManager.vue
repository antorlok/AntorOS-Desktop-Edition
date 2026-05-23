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

    <!-- ── MODAL OVERLAY: VISOR DE ARCHIVOS CYBERPUNK ── -->
    <Transition name="preview-fade">
      <div v-if="activePreviewFile" class="preview-modal-overlay" @click.self="activePreviewFile = null">
        <div class="preview-modal-card">
          <!-- Header del Visor -->
          <header class="preview-header">
            <div class="preview-title-meta">
              <component :is="getFileIcon(activePreviewFile.name)" class="preview-header-icon" />
              <div>
                <h3 class="preview-filename">{{ activePreviewFile.name }}</h3>
                <span class="preview-filesize">Tamaño: {{ activePreviewFile.size || 'Desconocido' }}</span>
              </div>
            </div>
            <button class="preview-close-btn" @click="activePreviewFile = null" title="Cerrar visor">×</button>
          </header>

          <!-- Cuerpo del Visor según el tipo de archivo -->
          <main class="preview-body">
            <!-- Caso 1: Imágenes (.png, .jpg, .jpeg) -->
            <div v-if="isImageFile(activePreviewFile.name)" class="preview-image-container">
              <!-- Render de Fotos Reales de la Webcam -->
              <div v-if="activePreviewFile.dataUrl" class="real-media-frame">
                <img :src="activePreviewFile.dataUrl" alt="Foto capturada" class="real-media-element" />
              </div>

              <!-- Vectoriales Cyber Neón por Defecto -->
              <div v-else class="neon-canvas-frame">
                <div v-if="activePreviewFile.name === 'neon-cityscape.png'" class="cyber-pic neon-cityscape-pic">
                  <div class="city-sun"></div>
                  <div class="city-skyline">
                    <div class="tower t1"></div>
                    <div class="tower t2"></div>
                    <div class="tower t3"></div>
                  </div>
                  <div class="grid-floor"></div>
                </div>
                <div v-else-if="activePreviewFile.name === 'cyberpunk-avatar.jpg'" class="cyber-pic cyberpunk-avatar-pic">
                  <div class="avatar-circle">
                    <div class="avatar-hair"></div>
                    <div class="avatar-face">
                      <div class="cyber-visor"></div>
                    </div>
                  </div>
                </div>
                <div v-else class="cyber-pic generic-pic">
                  <ImageIcon class="generic-pic-icon" />
                  <span>PREVIEW GRÁFICO CYBER</span>
                </div>
              </div>
            </div>

            <!-- Caso 1b: Videos Reales Grabados (.mp4 / .webm) -->
            <div v-else-if="isVideoFile(activePreviewFile.name)" class="preview-video-container">
              <div v-if="activePreviewFile.dataUrl" class="real-media-frame">
                <video controls autoplay :src="activePreviewFile.dataUrl" class="real-media-element"></video>
              </div>
              <div v-else class="cyber-pic generic-pic">
                <VideoIcon class="generic-pic-icon" />
                <span>Simulación de Video Virtual</span>
              </div>
            </div>

            <!-- Caso 2: Texto o JSON (.txt, .json) -->
            <div v-else-if="isTextFile(activePreviewFile.name)" class="preview-text-container">
              <pre class="preview-code-block"><code>{{ getMockTextContent(activePreviewFile.name) }}</code></pre>
            </div>

            <!-- Caso 3: Documento (.pdf o .docx) -->
            <div v-else-if="isDocFile(activePreviewFile.name)" class="preview-doc-container">
              <div class="hologram-document">
                <BookOpenIcon class="doc-holo-icon" />
                <h4>{{ activePreviewFile.name === 'proyecto-sistemas.pdf' ? 'PROYECTO: SISTEMAS DE OPERACIÓN' : 'ARQUITECTURA DE ANTORUI' }}</h4>
                <div class="doc-holo-lines">
                  <p v-for="i in 4" :key="i" class="holo-text-line"></p>
                </div>
                <span class="holo-doc-badge">DOCUMENTO ENCRIPTADO HOLOGRÁFICO</span>
              </div>
            </div>

            <!-- Caso 4: Archivos binarios / ISO (.iso) -->
            <div v-else class="preview-binary-container">
              <div class="binary-card">
                <FileIcon class="binary-icon" />
                <h4>Imagen de Disco ISO del Sistema</h4>
                <div class="binary-hash-box">
                  <span class="hash-label">MD5:</span>
                  <span class="hash-value">5d41402abc4b2a76b9719d911017c592</span>
                </div>
                <button class="verify-btn" @click="simulateIsoVerification">Verificar Firma Digital</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOSStore } from '@/stores/osStore';
import {
  Folder as FolderIcon,
  File as FileIcon,
  FileText as FileTextIcon,
  Image as ImageIcon,
  ArrowLeft as ArrowLeftIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
  BookOpen as BookOpenIcon,
  Video as VideoIcon
} from 'lucide-vue-next';

const osStore = useOSStore();

// Ruta interna actual
const currentPath = ref('Inicio');
const selectedItemName = ref<string | null>(null);

// Archivo actualmente en vista previa
const activePreviewFile = ref<FileItem | null>(null);

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
  dataUrl?: string;
}

// Computado de archivos de la ruta actual extraídos reactivamente del Pinia store unificado
const currentFiles = computed(() => {
  return osStore.fileSystem[currentPath.value] || [];
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
    case 'mp4':
    case 'webm':
      return VideoIcon;
    default:
      return FileIcon;
  }
}

function isImageFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ['png', 'jpg', 'jpeg'].includes(ext || '');
}

function isVideoFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ['mp4', 'webm'].includes(ext || '');
}

function isTextFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ['txt', 'json'].includes(ext || '');
}

function isDocFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ['pdf', 'docx'].includes(ext || '');
}

function getMockTextContent(filename: string): string {
  if (filename === 'bitacora-desarrollo.txt') {
    return `[2026-05-22 22:45] - Inicialización del Kernel AntorOS completada con éxito.
[2026-05-22 22:50] - daemon de Go escuchando en ws://127.0.0.1:8080.
[2026-05-22 23:00] - Compilación del frontend Vue 3 exitosa (1792 módulos).
[2026-05-22 23:05] - Commited all core assets to Git repository.
[2026-05-22 23:10] - Cargada la telemetría en tiempo real en SystemMonitor.`;
  }
  if (filename === 'config.json') {
    return `{
  "system": {
    "name": "AntorOS",
    "version": "2.0.0-Cyberpunk",
    "kernel": "Go-Daemon-1.4.0",
    "gui": "Vue3-CompositionAPI"
  },
  "display": {
    "theme": "Neon-Magenta-Cyan",
    "resolution": "1920x1080",
    "animations": true
  }
}`;
  }
  return '// Sin vista previa de texto disponible.';
}

function simulateIsoVerification() {
  alert('Iniciando verificación holográfica del sector boot... \nFirma digital de AntorOS verificada: 100% CORRECTO.');
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
    // Abrir visor interactivo cyberpunk
    activePreviewFile.value = item;
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
  position: relative;
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

/* ── MODAL OVERLAY: VISOR DE ARCHIVOS CYBERPUNK ── */
.preview-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(2, 6, 23, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 1000;
}

.preview-modal-card {
  width: 100%;
  max-width: 580px;
  height: 80%;
  max-height: 420px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(34, 211, 238, 0.25);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(34, 211, 238, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: rgba(2, 6, 23, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.preview-title-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-header-icon {
  width: 24px;
  height: 24px;
  color: #22d3ee;
}

.preview-filename {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
}

.preview-filesize {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.preview-close-btn {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s ease;
}

.preview-close-btn:hover {
  color: #f43f5e;
}

.preview-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: rgba(10, 15, 30, 0.2);
}

/* Contenedores por tipo de archivo */
.preview-image-container,
.preview-video-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.real-media-frame {
  width: 100%;
  max-width: 480px;
  height: 260px;
  background: #020617;
  border: 1px solid rgba(34, 211, 238, 0.25);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.real-media-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.neon-canvas-frame {
  width: 100%;
  max-width: 480px;
  height: 260px;
  background: #020617;
  border: 1px dashed rgba(34, 211, 238, 0.3);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Dibujos neón simulados */
.cyber-pic {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Escena de Ciudad Neón */
.neon-cityscape-pic {
  background: linear-gradient(to bottom, #020617 0%, #1e1b4b 100%);
}

.city-sun {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background: radial-gradient(circle, #f43f5e 20%, #d946ef 100%);
  border-radius: 50%;
  box-shadow: 0 0 25px #d946ef;
}

.city-skyline {
  position: absolute;
  bottom: 40px;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  z-index: 2;
}

.tower {
  background: #090d16;
  border: 1px solid rgba(217, 70, 239, 0.4);
  box-shadow: 0 0 10px rgba(217, 70, 239, 0.2);
}

.t1 { width: 50px; height: 70px; }
.t2 { width: 60px; height: 90px; border-color: rgba(34, 211, 238, 0.4); box-shadow: 0 0 10px rgba(34, 211, 238, 0.2); }
.t3 { width: 45px; height: 60px; }

.grid-floor {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  background: 
    linear-gradient(rgba(34, 211, 238, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.15) 1px, transparent 1px);
  background-size: 20px 20px;
  transform: perspective(40px) rotateX(25deg);
  z-index: 3;
}

/* Avatar Cyberpunk */
.cyberpunk-avatar-pic {
  background: radial-gradient(circle, #1e1b4b 0%, #020617 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 2px solid #d946ef;
  box-shadow: 0 0 20px rgba(217, 70, 239, 0.4);
  position: relative;
  overflow: hidden;
  background: #0f172a;
}

.avatar-hair {
  position: absolute;
  top: 10px;
  left: 15px;
  width: 80px;
  height: 50px;
  background: #d946ef;
  border-radius: 40px 40px 0 0;
}

.avatar-face {
  position: absolute;
  bottom: 15px;
  left: 25px;
  width: 60px;
  height: 60px;
  background: #fbcfe8;
  border-radius: 50% 50% 40% 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cyber-visor {
  width: 50px;
  height: 14px;
  background: #22d3ee;
  box-shadow: 0 0 10px #22d3ee;
  border-radius: 4px;
  margin-top: -14px;
}

/* Genéricos y otros */
.generic-pic {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.45);
}

.generic-pic-icon {
  width: 48px;
  height: 48px;
  color: #22d3ee;
}

/* Visor de Texto */
.preview-text-container {
  width: 100%;
  height: 100%;
}

.preview-code-block {
  width: 100%;
  height: 100%;
  min-height: 260px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8rem;
  color: #34d399;
  line-height: 1.5;
  text-align: left;
}

/* Visor Documento */
.preview-doc-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hologram-document {
  width: 100%;
  max-width: 400px;
  background: rgba(34, 211, 238, 0.03);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.05);
}

.doc-holo-icon {
  width: 40px;
  height: 40px;
  color: #22d3ee;
  margin-bottom: 12px;
  filter: drop-shadow(0 0 6px #22d3ee);
}

.hologram-document h4 {
  font-size: 0.95rem;
  color: #ffffff;
  margin-bottom: 16px;
}

.doc-holo-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.holo-text-line {
  height: 4px;
  background: rgba(34, 211, 238, 0.2);
  border-radius: 2px;
}

.holo-text-line:nth-child(even) {
  width: 70%;
  margin: 0 auto;
}

.holo-doc-badge {
  font-size: 0.7rem;
  font-weight: bold;
  color: #22d3ee;
  letter-spacing: 0.5px;
}

/* Visor Binario / ISO */
.preview-binary-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.binary-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  max-width: 380px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.binary-icon {
  width: 44px;
  height: 44px;
  color: #d946ef;
  margin-bottom: 14px;
  filter: drop-shadow(0 0 6px #d946ef);
}

.binary-card h4 {
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 16px;
}

.binary-hash-box {
  background: rgba(2, 6, 23, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  font-family: monospace;
  font-size: 0.75rem;
  margin-bottom: 20px;
}

.hash-label {
  color: rgba(255, 255, 255, 0.35);
}

.hash-value {
  color: #d946ef;
}

.verify-btn {
  padding: 8px 20px;
  background: rgba(217, 70, 239, 0.1);
  border: 1px solid rgba(217, 70, 239, 0.25);
  border-radius: 8px;
  color: #d946ef;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.verify-btn:hover {
  background: rgba(217, 70, 239, 0.2);
  border-color: #d946ef;
  box-shadow: 0 0 12px rgba(217, 70, 239, 0.3);
}

/* Transiciones */
.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.25s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}

.preview-fade-enter-active .preview-modal-card {
  animation: pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pop-in {
  from {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>

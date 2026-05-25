<template>
  <div class="office-container">
    <!-- ── CASO 1: HUB INICIAL (DASHBOARD GAMER) ── -->
    <div v-if="activeMode === 'hub'" class="office-hub-view">
      <!-- Sidebar de Navegación Izquierdo -->
      <aside class="hub-sidebar">
        <div class="sidebar-top">
          <button
            class="sidebar-tab"
            :class="{ 'sidebar-tab-active': sidebarTab === 'inicio' }"
            @click="sidebarTab = 'inicio'"
          >
            <HomeIcon class="sidebar-icon" />
            <span>Inicio</span>
          </button>

          <button
            class="sidebar-tab"
            :class="{ 'sidebar-tab-active': sidebarTab === 'abrir' }"
            @click="sidebarTab = 'abrir'"
          >
            <FolderOpenIcon class="sidebar-icon" />
            <span>Abrir archivo local</span>
          </button>

          <button
            class="sidebar-tab"
            :class="{ 'sidebar-tab-active': sidebarTab === 'plantillas' }"
            @click="sidebarTab = 'plantillas'"
          >
            <LayoutTemplateIcon class="sidebar-icon" />
            <span>Plantillas</span>
          </button>
        </div>

        <div class="sidebar-bottom">
          <span class="nubes-header">Nubes <PlusIcon class="nubes-add" /></span>
          <div class="nube-empty">Sin nubes conectadas</div>
        </div>
      </aside>

      <!-- Panel de Contenido Principal -->
      <main class="hub-main-content">
        <!-- PESTAÑA: INICIO -->
        <section v-if="sidebarTab === 'inicio'" class="hub-section">
          <!-- Lanzadores de Nuevos Archivos -->
          <div class="launchers-grid">
            <!-- DOCX Card -->
            <button class="launch-card card-docx" @click="launchNewDoc('docx')">
              <div class="card-badge badge-docx">DOCX</div>
              <FileTextIcon class="card-icon" />
              <span class="card-label">Documento</span>
            </button>

            <!-- XLSX Card -->
            <button class="launch-card card-xlsx" @click="launchNewDoc('xlsx')">
              <div class="card-badge badge-xlsx">XLSX</div>
              <TableIcon class="card-icon" />
              <span class="card-label">Hoja de cálculo</span>
            </button>

            <!-- PDF Card -->
            <button class="launch-card card-pdf" @click="launchNewDoc('pdf')">
              <div class="card-badge badge-pdf">PDF</div>
              <BookOpenIcon class="card-icon" />
              <span class="card-label">PDF Editor</span>
            </button>
          </div>

          <!-- Archivos Recientes -->
          <div class="recent-files-area">
            <h3 class="recent-title">Archivos recientes</h3>
            <div class="recent-table-wrapper">
              <table class="recent-table">
                <thead>
                  <tr>
                    <th>Nombre de archivo</th>
                    <th>Ubicación</th>
                    <th>Tamaño</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="file in documentFiles"
                    :key="file.name"
                    class="recent-row"
                    @dblclick="openExistingFile(file)"
                    title="Doble clic para abrir en el editor"
                  >
                    <td class="file-name-cell">
                      <FileTextIcon v-if="file.name.endsWith('.docx')" class="table-file-icon icon-docx" />
                      <TableIcon v-else-if="file.name.endsWith('.xlsx')" class="table-file-icon icon-xlsx" />
                      <BookOpenIcon v-else class="table-file-icon icon-pdf" />
                      {{ file.name }}
                    </td>
                    <td class="file-path-cell">Sistema / Documentos</td>
                    <td class="file-size-cell">{{ file.size || '12 KB' }}</td>
                    <td class="file-type-cell">
                      <span
                        class="format-tag"
                        :class="file.name.endsWith('.docx') ? 'tag-docx' : (file.name.endsWith('.xlsx') ? 'tag-xlsx' : 'tag-pdf')"
                      >
                        {{ file.name.split('.').pop()?.toUpperCase() }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="documentFiles.length === 0">
                    <td colspan="4" class="table-empty-state">
                      Ningún documento guardado aún. ¡Crea uno arriba!
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- PESTAÑA: ABRIR ARCHIVO LOCAL -->
        <section v-else-if="sidebarTab === 'abrir'" class="hub-section">
          <h2 class="section-title">Abrir archivo local del Sistema</h2>
          <p class="section-desc">Selecciona un archivo guardado en el directorio de Documentos para reanudar su edición.</p>
          
          <div class="local-explorer-grid">
            <button
              v-for="file in documentFiles"
              :key="file.name"
              class="explorer-file-card"
              @click="openExistingFile(file)"
            >
              <FileTextIcon v-if="file.name.endsWith('.docx')" class="explorer-file-icon icon-docx" />
              <TableIcon v-else-if="file.name.endsWith('.xlsx')" class="explorer-file-icon icon-xlsx" />
              <span class="explorer-filename">{{ file.name }}</span>
              <span class="explorer-filesize">{{ file.size || '10 KB' }}</span>
            </button>
            <div v-if="documentFiles.length === 0" class="empty-explorer-state">
              No hay documentos guardados para abrir. Crea y guarda uno en el menú "Inicio".
            </div>
          </div>
        </section>

        <!-- PESTAÑA: PLANTILLAS -->
        <section v-else-if="sidebarTab === 'plantillas'" class="hub-section">
          <h2 class="section-title">Plantillas de Oficina Cyber</h2>
          <div class="templates-grid">
            <div class="template-card" @click="loadTemplate('docx', 'Informe del Sistema')">
              <FileTextIcon class="template-icon icon-docx" />
              <h4>Informe del Sistema</h4>
              <span>Estructura de logs y reportes</span>
            </div>
            <div class="template-card" @click="loadTemplate('xlsx', 'Presupuesto de Red')">
              <TableIcon class="template-icon icon-xlsx" />
              <h4>Presupuesto de Red</h4>
              <span>Celdas numéricas preconfiguradas</span>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- ── CASO 2: EDITOR DOCX (PROCESADOR DE TEXTOS) ── -->
    <div v-else-if="activeMode === 'docx'" class="office-editor-view">
      <!-- Ribbon Bar de DOCX -->
      <header class="editor-ribbon">
        <button class="ribbon-back-btn" @click="backToHub" title="Volver al inicio">
          <ArrowLeftIcon class="ribbon-back-icon" />
        </button>

        <div class="ribbon-group">
          <button class="ribbon-btn" @click="formatDoc('bold')" title="Negrita (Ctrl+B)">
            <BoldIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('italic')" title="Cursiva (Ctrl+I)">
            <ItalicIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('underline')" title="Subrayado (Ctrl+U)">
            <UnderlineIcon class="ribbon-icon" />
          </button>
        </div>

        <div class="ribbon-divider"></div>

        <div class="ribbon-group">
          <button class="ribbon-btn" @click="formatDoc('justifyLeft')" title="Alinear a la izquierda">
            <AlignLeftIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('justifyCenter')" title="Centrar">
            <AlignCenterIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('justifyRight')" title="Alinear a la derecha">
            <AlignRightIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('justifyFull')" title="Justificar">
            <AlignJustifyIcon class="ribbon-icon" />
          </button>
        </div>

        <!-- Acciones de Guardar -->
        <div class="ribbon-actions">
          <input
            v-model="fileNameInput"
            type="text"
            class="ribbon-filename-input"
            placeholder="documento.docx"
            spellcheck="false"
          />
          <button class="ribbon-save-btn btn-docx-theme" @click="openSaveDialog('docx')">
            <SaveIcon class="save-icon" />
            Guardar
          </button>
        </div>
      </header>

      <!-- Espacio de trabajo papel DOCX -->
      <div class="editor-workspace">
        <div class="paper-wrapper">
          <div
            ref="docxEditorRef"
            class="virtual-paper"
            contenteditable="true"
            spellcheck="false"
            role="textbox"
            aria-multiline="true"
            aria-label="Documento de texto"
          ></div>
        </div>
      </div>
    </div>

    <!-- ── CASO 3: EDITOR XLSX (HOJA DE CÁLCULO) ── -->
    <div v-else-if="activeMode === 'xlsx'" class="office-editor-view">
      <!-- Ribbon Bar de XLSX -->
      <header class="editor-ribbon">
        <button class="ribbon-back-btn" @click="backToHub" title="Volver al inicio">
          <ArrowLeftIcon class="ribbon-back-icon" />
        </button>

        <!-- Paleta de Relleno de Color de Celda Neón -->
        <div class="ribbon-group color-picker-group">
          <span class="color-picker-label"><PaintbrushIcon class="brush-icon" /> Relleno:</span>
          <button
            v-for="color in fillColors"
            :key="color.class"
            class="color-dot"
            :class="[color.class, { 'active-color': activeFillColorClass === color.class }]"
            @click="applyCellColor(color.class)"
            :title="color.label"
          ></button>
        </div>

        <div class="ribbon-divider"></div>

        <!-- Herramientas básicas de organización -->
        <div class="ribbon-group">
          <button class="ribbon-btn" @click="clearSelectedCell" title="Limpiar contenido de celda">
            Limpiar
          </button>
          <button class="ribbon-btn" @click="sumActiveColumn" title="Calcular Sumatoria de columna activa">
            ∑ Suma Col
          </button>
        </div>

        <!-- Acciones de Guardar -->
        <div class="ribbon-actions">
          <input
            v-model="fileNameInput"
            type="text"
            class="ribbon-filename-input"
            placeholder="planilla.xlsx"
            spellcheck="false"
          />
          <button class="ribbon-save-btn btn-xlsx-theme" @click="openSaveDialog('xlsx')">
            <SaveIcon class="save-icon" />
            Guardar
          </button>
        </div>
      </header>

      <!-- Cuadrícula de Hoja de Cálculo Interactiva -->
      <div class="spreadsheet-workspace">
        <div class="xlsx-sheet-card">
          <div class="sheet-table-wrapper">
            <table class="xlsx-table">
              <thead>
                <tr>
                  <th class="col-header corner-header"></th>
                  <th v-for="col in xlsxCols" :key="col" class="col-header">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in xlsxRows" :key="row">
                  <td class="row-header">{{ row }}</td>
                  <td
                    v-for="col in xlsxCols"
                    :key="col"
                    class="xlsx-cell"
                    :class="getCellBgClass(row, col)"
                    @click="focusCell(row, col)"
                  >
                    <input
                      type="text"
                      class="cell-input"
                      v-model="xlsxGrid[`${col}${row}`].value"
                      @focus="focusCell(row, col)"
                      spellcheck="false"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CASO 4: EDITOR PDF ESTILO ONLYOFFICE ── -->
    <div v-else-if="activeMode === 'pdf'" class="office-editor-view">
      <!-- Ribbon Bar de PDF Editor -->
      <header class="editor-ribbon">
        <button class="ribbon-back-btn" @click="backToHub" title="Volver al inicio">
          <ArrowLeftIcon class="ribbon-back-icon" />
        </button>

        <div class="ribbon-group">
          <button class="ribbon-btn" @click="formatDoc('bold')" title="Negrita (Ctrl+B)">
            <BoldIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('italic')" title="Cursiva (Ctrl+I)">
            <ItalicIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('underline')" title="Subrayado (Ctrl+U)">
            <UnderlineIcon class="ribbon-icon" />
          </button>
        </div>

        <div class="ribbon-divider"></div>

        <div class="ribbon-group">
          <button class="ribbon-btn" @click="formatDoc('justifyLeft')" title="Alinear a la izquierda">
            <AlignLeftIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('justifyCenter')" title="Centrar">
            <AlignCenterIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('justifyRight')" title="Alinear a la derecha">
            <AlignRightIcon class="ribbon-icon" />
          </button>
          <button class="ribbon-btn" @click="formatDoc('justifyFull')" title="Justificar">
            <AlignJustifyIcon class="ribbon-icon" />
          </button>
        </div>

        <!-- Acciones de Guardar -->
        <div class="ribbon-actions">
          <input
            v-model="fileNameInput"
            type="text"
            class="ribbon-filename-input"
            placeholder="documento.pdf"
            spellcheck="false"
          />
          <button class="ribbon-save-btn btn-pdf-theme" @click="openSaveDialog('pdf')">
            <SaveIcon class="save-icon" />
            Guardar
          </button>
        </div>
      </header>

      <!-- Papel PDF Editable OnlyOffice -->
      <div class="pdf-workspace">
        <div class="pdf-paper-wrapper">
          <div
            ref="pdfEditorRef"
            class="pdf-hologram-sheet"
            contenteditable="true"
            spellcheck="false"
            role="textbox"
            aria-multiline="true"
            aria-label="Editor de PDF OnlyOffice"
          ></div>
        </div>
      </div>
    </div>

    <!-- Selector de Archivos al estilo GNOME Files -->
    <Transition name="fade">
      <div v-if="isSaveDialogOpen" class="gnome-dialog-overlay" @click.self="closeSaveDialog">
        <div class="gnome-dialog-card">
          <!-- Cabecera -->
          <header class="gnome-dialog-header">
            <div class="header-left">
              <FolderOpenIcon class="header-icon" />
              <span class="dialog-title">Guardar Como</span>
            </div>
            <button class="dialog-close-btn" @click="closeSaveDialog">✕</button>
          </header>

          <!-- Cuerpo Principal -->
          <div class="gnome-dialog-body">
            <!-- Barra Lateral de Lugares (Estilo GNOME) -->
            <aside class="gnome-dialog-sidebar">
              <span class="sidebar-title">Lugares</span>
              <button 
                v-for="folder in availableFolders" 
                :key="folder"
                class="sidebar-folder-btn"
                :class="{ 'active-folder': selectedFolderForSave === folder }"
                @click="selectedFolderForSave = folder"
              >
                <FolderOpenIcon class="folder-btn-icon" />
                <span>{{ folder }}</span>
              </button>
            </aside>

            <!-- Lista de Archivos (Previsualización) -->
            <main class="gnome-dialog-content">
              <div class="content-header-path">
                <span class="content-path-title">Sistema / <strong>{{ selectedFolderForSave }}</strong></span>
              </div>
              <div class="files-preview-list">
                <div 
                  v-for="file in (osStore.fileSystem[selectedFolderForSave] || [])" 
                  :key="file.name"
                  class="file-preview-item"
                >
                  <FileTextIcon v-if="file.name.endsWith('.docx') || file.name.endsWith('.txt')" class="file-preview-icon icon-docx" />
                  <TableIcon v-else-if="file.name.endsWith('.xlsx')" class="file-preview-icon icon-xlsx" />
                  <BookOpenIcon v-else class="file-preview-icon icon-pdf" />
                  <div class="file-preview-details">
                    <span class="file-preview-name">{{ file.name }}</span>
                    <span class="file-preview-size">{{ file.size || '12 KB' }}</span>
                  </div>
                </div>
                <div v-if="(osStore.fileSystem[selectedFolderForSave] || []).length === 0" class="empty-preview-state">
                  Carpeta vacía. Sin archivos guardados aquí.
                </div>
              </div>
            </main>
          </div>

          <!-- Pie de Página (GNOME Footer) -->
          <footer class="gnome-dialog-footer">
            <div class="dialog-name-input-group">
              <label for="dialog-filename">Nombre de archivo:</label>
              <input 
                id="dialog-filename" 
                v-model="fileNameInput" 
                type="text" 
                class="dialog-filename-input"
                placeholder="nombre_archivo"
                spellcheck="false"
              />
            </div>
            <div class="dialog-actions">
              <button class="btn-dialog-cancel" @click="closeSaveDialog">Cancelar</button>
              <button class="btn-dialog-save" @click="confirmSaveFile">Guardar</button>
            </div>
          </footer>
        </div>
      </div>
    </Transition>

    <!-- Mensaje Toast de Guardado Rápido -->
    <div class="save-toast" :class="{ 'toast-visible': saveMessage }">
      {{ saveMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useOSStore } from '@/stores/osStore';
import {
  Home as HomeIcon,
  FolderOpen as FolderOpenIcon,
  LayoutTemplate as LayoutTemplateIcon,
  Plus as PlusIcon,
  FileText as FileTextIcon,
  Table as TableIcon,
  Tv as TvIcon,
  BookOpen as BookOpenIcon,
  ArrowLeft as ArrowLeftIcon,
  Save as SaveIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustify as AlignJustifyIcon,
  Paintbrush as PaintbrushIcon
} from 'lucide-vue-next';

const osStore = useOSStore();

// Modos principales: 'hub', 'docx', 'xlsx', 'pdf'
const activeMode = ref<'hub' | 'docx' | 'xlsx' | 'pdf'>('hub');
const sidebarTab = ref<'inicio' | 'abrir' | 'plantillas'>('inicio');

// inputs de archivos
const fileNameInput = ref('');
const saveMessage = ref('');
const activeFileRef = ref<string | null>(null);

// ---- Editores Refs ----
const docxEditorRef = ref<HTMLDivElement | null>(null);
const pdfEditorRef = ref<HTMLDivElement | null>(null);

// ---- Paleta de Colores Neón para XLSX ----
const activeFillColorClass = ref('bg-transparent');
const fillColors = [
  { class: 'bg-transparent', label: 'Transparente' },
  { class: 'bg-neon-cyan', label: 'Celeste Neón' },
  { class: 'bg-neon-magenta', label: 'Fucsia Neón' },
  { class: 'bg-neon-emerald', label: 'Esmeralda Neón' },
  { class: 'bg-neon-amber', label: 'Ámbar Neón' }
];

// ---- Grilla de XLSX ----
const xlsxCols = ['A', 'B', 'C', 'D', 'E'];
const xlsxRows = [1, 2, 3, 4, 5, 6, 7, 8];

interface CellState {
  value: string;
  bgClass: string;
}

// Inicializador reactivo de celdas XLSX
const xlsxGrid = ref<Record<string, CellState>>({});
function initEmptyGrid() {
  xlsxGrid.value = {};
  for (const r of xlsxRows) {
    for (const c of xlsxCols) {
      xlsxGrid.value[`${c}${r}`] = { value: '', bgClass: 'bg-transparent' };
    }
  }
}
initEmptyGrid();

const activeCellKey = ref<string | null>(null);

function focusCell(row: number, col: string) {
  activeCellKey.value = `${col}${row}`;
  const cell = xlsxGrid.value[activeCellKey.value];
  activeFillColorClass.value = cell ? cell.bgClass : 'bg-transparent';
}

// Retorna la clase de color de fondo neón de una celda específica
function getCellBgClass(row: number, col: string): string {
  const cell = xlsxGrid.value[`${col}${row}`];
  return cell ? cell.bgClass : 'bg-transparent';
}

function applyCellColor(bgClass: string) {
  if (activeCellKey.value && xlsxGrid.value[activeCellKey.value]) {
    xlsxGrid.value[activeCellKey.value].bgClass = bgClass;
    activeFillColorClass.value = bgClass;
  }
}

function clearSelectedCell() {
  if (activeCellKey.value && xlsxGrid.value[activeCellKey.value]) {
    xlsxGrid.value[activeCellKey.value].value = '';
    xlsxGrid.value[activeCellKey.value].bgClass = 'bg-transparent';
    activeFillColorClass.value = 'bg-transparent';
  }
}

function sumActiveColumn() {
  if (!activeCellKey.value) return;
  const col = activeCellKey.value.charAt(0);
  let total = 0;
  
  for (const r of xlsxRows) {
    const val = parseFloat(xlsxGrid.value[`${col}${r}`].value);
    if (!isNaN(val)) total += val;
  }

  // Guardar sumatoria en la celda activa seleccionada
  xlsxGrid.value[activeCellKey.value].value = total.toString();
}

// Directorios ofimáticos disponibles para guardar
const availableFolders = ['Descargas', 'Documentos', 'Imágenes'];

// Estado del diálogo de guardado estilo GNOME
const isSaveDialogOpen = ref(false);
const selectedFolderForSave = ref('Documentos');
const saveType = ref<'docx' | 'xlsx' | 'pdf'>('docx');

function openSaveDialog(type: 'docx' | 'xlsx' | 'pdf') {
  saveType.value = type;
  isSaveDialogOpen.value = true;
}

function closeSaveDialog() {
  isSaveDialogOpen.value = false;
}

function confirmSaveFile() {
  if (saveType.value === 'docx') {
    executeSaveDocx();
  } else if (saveType.value === 'xlsx') {
    executeSaveXlsx();
  } else {
    executeSavePdf();
  }
  isSaveDialogOpen.value = false;
}

// Filtro de archivos con extensión ofimática guardados en TODOS los directorios escaneados
const documentFiles = computed(() => {
  const allFiles: { name: string; type: 'dir' | 'file'; size?: string; dataUrl?: string; folder: string }[] = [];
  availableFolders.forEach(folder => {
    const docs = osStore.fileSystem[folder] || [];
    docs.forEach(f => {
      if (f.name.endsWith('.docx') || f.name.endsWith('.xlsx') || f.name.endsWith('.pdf')) {
        allFiles.push({ ...f, folder });
      }
    });
  });
  return allFiles;
});

// ---- Lanzadores y Creación ----
function launchNewDoc(mode: 'docx' | 'xlsx' | 'pdf') {
  activeMode.value = mode;
  activeFileRef.value = null;

  if (mode === 'docx') {
    fileNameInput.value = `documento-${Date.now().toString().slice(-4)}.docx`;
    nextTick(() => {
      if (docxEditorRef.value) {
        docxEditorRef.value.innerHTML = `
          <h1 style="text-align: center;">Proyecto Final: Sistemas de Operación</h1>
          <p>Este es el procesador de texto holográfico de <strong>AntorUI</strong>. El editor soporta atajos de teclado nativos como <em>Ctrl+B</em> (Negrita), <em>Ctrl+I</em> (Cursiva) y <em>Ctrl+U</em> (Subrayado).</p>
          <p>Puedes formatear el contenido en tiempo real seleccionando cualquier porción de texto y haciendo clic en los botones de la cinta de opciones superior.</p>
        `;
      }
    });
  } else if (mode === 'xlsx') {
    fileNameInput.value = `planilla-${Date.now().toString().slice(-4)}.xlsx`;
    initEmptyGrid();
  } else if (mode === 'pdf') {
    fileNameInput.value = `documento-${Date.now().toString().slice(-4)}.pdf`;
    nextTick(() => {
      if (pdfEditorRef.value) {
        pdfEditorRef.value.innerHTML = `
          <h2 style="text-align: center; color: var(--neon-magenta); text-shadow: var(--glow-magenta); margin-top: 10px;">MANUAL DE KERNEL Y SEGURIDAD VIRTUAL</h2>
          <hr style="border: none; border-top: 1px solid rgba(255, 0, 255, 0.2); margin: 20px 0;" />
          <h3 style="color: var(--neon-cyan); text-shadow: var(--glow-cyan); margin-bottom: 8px;">Sección 1.0: Arquitectura de AntorOS</h3>
          <p style="color: rgba(255, 255, 255, 0.85); line-height: 1.6; margin-bottom: 20px;">AntorOS se basa en una arquitectura limpia y desacoplada (Clean Architecture) que coordina un Backend ligero escrito en Go nativo y un Frontend reactivo de alto rendimiento implementado en Vue 3 y Pinia.</p>
          <h3 style="color: var(--neon-cyan); text-shadow: var(--glow-cyan); margin-bottom: 8px;">Sección 2.0: Telemetría en tiempo real</h3>
          <p style="color: rgba(255, 255, 255, 0.85); line-height: 1.6; margin-bottom: 20px;">La telemetría del sistema fluye bidireccionalmente mediante WebSockets. El daemon recopila y publica métricas de CPU y RAM del microcontrolador anfitrión y el store las sincroniza reactivamente en la interfaz.</p>
        `;
      }
    });
  }
}

function backToHub() {
  activeMode.value = 'hub';
  activeFileRef.value = null;
}

// ---- execCommand de formato DOCX ----
function formatDoc(command: string) {
  document.execCommand(command, false);
  docxEditorRef.value?.focus();
}

// ---- Persistencia: Guardar Archivos en Pinia ----
function executeSaveDocx() {
  if (!docxEditorRef.value) return;
  const contentHtml = docxEditorRef.value.innerHTML;
  let filename = fileNameInput.value.trim();
  if (!filename) filename = 'documento';
  if (!filename.endsWith('.docx')) filename += '.docx';

  // Registrar en el store en la carpeta seleccionada por el usuario
  osStore.addFileToFolder(selectedFolderForSave.value, {
    name: filename,
    type: 'file',
    size: `${Math.round(contentHtml.length / 1024) || 1} KB`,
    dataUrl: contentHtml // Guardamos el HTML de formateo del docx en dataUrl
  });

  triggerToast(`¡Documento DOCX guardado con éxito en ${selectedFolderForSave.value}!`);
}

function executeSaveXlsx() {
  const contentJson = JSON.stringify(xlsxGrid.value);
  let filename = fileNameInput.value.trim();
  if (!filename) filename = 'planilla';
  if (!filename.endsWith('.xlsx')) filename += '.xlsx';

  osStore.addFileToFolder(selectedFolderForSave.value, {
    name: filename,
    type: 'file',
    size: '12 KB',
    dataUrl: contentJson // Guardamos la planilla en dataUrl
  });

  triggerToast(`¡Planilla XLSX guardada con éxito en ${selectedFolderForSave.value}!`);
}

function executeSavePdf() {
  if (!pdfEditorRef.value) return;
  const contentHtml = pdfEditorRef.value.innerHTML;
  let filename = fileNameInput.value.trim();
  if (!filename) filename = 'documento';
  if (!filename.endsWith('.pdf')) filename += '.pdf';

  osStore.addFileToFolder(selectedFolderForSave.value, {
    name: filename,
    type: 'file',
    size: `${Math.round(contentHtml.length / 1024) || 1} KB`,
    dataUrl: contentHtml
  });

  triggerToast(`¡Documento PDF guardado con éxito en ${selectedFolderForSave.value}!`);
}

// ---- Apertura de Archivos Existentes ----
function openExistingFile(file: { name: string; dataUrl?: string }) {
  if (file.name.endsWith('.docx')) {
    activeMode.value = 'docx';
    fileNameInput.value = file.name;
    activeFileRef.value = file.name;
    nextTick(() => {
      if (docxEditorRef.value) {
        docxEditorRef.value.innerHTML = file.dataUrl || '<p></p>';
      }
    });
  } else if (file.name.endsWith('.xlsx')) {
    activeMode.value = 'xlsx';
    fileNameInput.value = file.name;
    activeFileRef.value = file.name;
    if (file.dataUrl) {
      try {
        xlsxGrid.value = JSON.parse(file.dataUrl);
      } catch (err) {
        initEmptyGrid();
      }
    } else {
      initEmptyGrid();
    }
  } else if (file.name.endsWith('.pdf')) {
    activeMode.value = 'pdf';
    fileNameInput.value = file.name;
    activeFileRef.value = file.name;
    nextTick(() => {
      if (pdfEditorRef.value) {
        pdfEditorRef.value.innerHTML = file.dataUrl || '<p></p>';
      }
    });
  }
}

// ---- Cargar Plantillas preestablecidas ----
function loadTemplate(type: 'docx' | 'xlsx', name: string) {
  if (type === 'docx') {
    activeMode.value = 'docx';
    fileNameInput.value = 'Informe del Sistema.docx';
    nextTick(() => {
      if (docxEditorRef.value) {
        docxEditorRef.value.innerHTML = `
          <h1 style="text-align: center; color: #22d3ee;">INFORME CRÍTICO DEL KERNEL</h1>
          <p>Estado del microcontrolador: <strong>ESTABLE</strong></p>
          <p>Módulos de telemetría inyectados: <strong>OK</strong></p>
          <p>Proceso del Daemon de Go escuchando peticiones en puerto 8080 de forma ininterrumpida.</p>
        `;
      }
    });
  } else if (type === 'xlsx') {
    activeMode.value = 'xlsx';
    fileNameInput.value = 'Presupuesto de Red.xlsx';
    initEmptyGrid();
    xlsxGrid.value['A1'].value = 'Cables';
    xlsxGrid.value['B1'].value = '150';
    xlsxGrid.value['A2'].value = 'Routers';
    xlsxGrid.value['B2'].value = '350';
    xlsxGrid.value['A3'].value = 'Total';
  }
}

function triggerToast(msg: string) {
  saveMessage.value = msg;
  setTimeout(() => {
    saveMessage.value = '';
  }, 2500);
}
</script>

<style scoped>
.office-container {
  display: flex;
  width: 100%;
  height: 100%;
  background: #020617;
  color: #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
  position: relative;
}

/* ── ESTILOS DEL HUB INICIAL ── */
.office-hub-view {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Sidebar Estilo Cyberpunk */
.hub-sidebar {
  width: 200px;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 10px;
  user-select: none;
}

.sidebar-top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-tab {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-tab:hover {
  background: rgba(34, 211, 238, 0.05);
  color: #22d3ee;
}

.sidebar-tab-active {
  background: rgba(34, 211, 238, 0.1) !important;
  color: #22d3ee !important;
  border-color: rgba(34, 211, 238, 0.25) !important;
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.15);
}

.sidebar-icon {
  width: 16px;
  height: 16px;
}

.sidebar-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 16px;
}

.nubes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  padding: 0 6px;
}

.nubes-add {
  width: 14px;
  height: 14px;
  cursor: pointer;
  color: #22d3ee;
}

.nubes-add:hover {
  color: #ffffff;
}

.nube-empty {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  padding: 4px 6px;
  font-style: italic;
}

/* Panel de Contenido */
.hub-main-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.hub-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
  height: 100%;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

.section-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: -24px;
}

/* Rejilla de Lanzadores de Archivos */
.launchers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 20px;
}

.launch-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: rgba(15, 23, 42, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.launch-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.card-icon {
  width: 36px;
  height: 36px;
  transition: all 0.2s ease;
}

.card-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.launch-card:hover .card-label {
  color: #ffffff;
}

.card-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 0.65rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Estilos de formato específicos del Hub */
.card-docx .card-icon { color: #38bdf8; }
.card-docx:hover { border-color: #38bdf8; background: rgba(56, 189, 248, 0.04); box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
.badge-docx { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }

.card-xlsx .card-icon { color: #10b981; }
.card-xlsx:hover { border-color: #10b981; background: rgba(16, 185, 129, 0.04); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
.badge-xlsx { background: rgba(16, 185, 129, 0.15); color: #10b981; }

.card-pptx .card-icon { color: #f97316; }
.card-pptx:hover { border-color: #f97316; background: rgba(249, 115, 22, 0.04); box-shadow: 0 0 15px rgba(249, 115, 22, 0.2); }
.badge-pptx { background: rgba(249, 115, 22, 0.15); color: #f97316; }

.card-pdf .card-icon { color: #ef4444; }
.card-pdf:hover { border-color: #ef4444; background: rgba(239, 68, 68, 0.04); box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
.badge-pdf { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

/* Tabla de Archivos Recientes */
.recent-files-area {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.recent-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recent-table-wrapper {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.recent-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8rem;
}

.recent-table th {
  background: rgba(2, 6, 23, 0.35);
  padding: 10px 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.recent-table td {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.recent-row {
  cursor: pointer;
  transition: background 0.2s ease;
}

.recent-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.table-file-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
}

.icon-docx { color: #38bdf8; }
.icon-xlsx { color: #10b981; }
.icon-pdf { color: #ef4444; }

.format-tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: bold;
}

.tag-docx { background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); }
.tag-xlsx { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
.tag-pdf { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

.table-empty-state {
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  padding: 30px 0;
}

/* Explorer integrado para abrir archivos */
.local-explorer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.explorer-file-card {
  background: rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.explorer-file-card:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

.explorer-file-icon {
  width: 28px;
  height: 28px;
}

.explorer-filename {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.explorer-filesize {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
}

.empty-explorer-state {
  grid-column: 1 / -1;
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  padding: 60px 0;
}

/* Plantillas */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.template-card {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-card:hover {
  border-color: #22d3ee;
  background: rgba(34, 211, 238, 0.03);
}

.template-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
}

.template-card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
}

.template-card span {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}


/* ── ESTILOS DEL EDITOR CORE ── */
.office-editor-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

/* Ribbon de herramientas */
.editor-ribbon {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 16px;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 10;
  user-select: none;
}

.ribbon-back-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.ribbon-back-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.ribbon-back-icon {
  width: 18px;
  height: 18px;
}

.ribbon-group {
  display: flex;
  gap: 6px;
  align-items: center;
}

.ribbon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  padding: 0 6px;
}

.ribbon-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
  color: #22d3ee;
}

.ribbon-icon {
  width: 18px;
  height: 18px;
}

.ribbon-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.15);
}

.ribbon-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.ribbon-filename-input {
  background: rgba(2, 6, 23, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 4px 10px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.8rem;
  outline: none;
  width: 160px;
}

.ribbon-filename-input:focus {
  border-color: #22d3ee;
}

.ribbon-save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-docx-theme {
  background: rgba(56, 189, 248, 0.15);
  border-color: rgba(56, 189, 248, 0.3);
  color: #38bdf8;
}
.btn-docx-theme:hover {
  background: rgba(56, 189, 248, 0.25);
  border-color: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
}

.btn-xlsx-theme {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}
.btn-xlsx-theme:hover {
  background: rgba(16, 185, 129, 0.25);
  border-color: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.btn-pdf-theme {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
.btn-pdf-theme:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.save-icon {
  width: 14px;
  height: 14px;
}


/* ---- DOCX WORKSPACE ---- */
.editor-workspace {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  background: #0f172a;
  display: flex;
  justify-content: center;
}

.paper-wrapper {
  width: 100%;
  max-width: 760px;
  min-height: 100%;
}

.virtual-paper {
  width: 100%;
  min-height: 700px;
  background: #ffffff;
  color: #0f172a;
  padding: 50px 40px;
  border-radius: 4px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  outline: none;
  font-family: Georgia, serif;
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: left;
}


/* ---- XLSX WORKSPACE ---- */
.spreadsheet-workspace {
  flex: 1;
  padding: 20px;
  background: #0f172a;
  overflow: auto;
}

.xlsx-sheet-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
}

.sheet-table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.xlsx-table {
  width: 100%;
  border-collapse: collapse;
}

.col-header,
.row-header {
  background: rgba(2, 6, 23, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.4);
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: bold;
  height: 28px;
  user-select: none;
  text-align: center;
}

.corner-header {
  width: 40px;
  max-width: 40px;
}

.row-header {
  width: 40px;
  max-width: 40px;
}

.xlsx-cell {
  height: 28px;
  border-right: 1px solid rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  position: relative;
  transition: background-color 0.2s ease;
}

.cell-input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-family: monospace;
  font-size: 0.8rem;
  padding: 0 8px;
}

/* Paleta de colores neón XLSX */
.color-picker-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-picker-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 4px;
}

.brush-icon {
  width: 12px;
  height: 12px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.15s ease;
}

.color-dot:hover {
  transform: scale(1.15);
}

.active-color {
  border-color: #ffffff !important;
  box-shadow: 0 0 8px currentColor;
}

/* Estilos de celdas coloridas neón */
.bg-transparent { background-color: transparent; }
.bg-neon-cyan { background-color: rgba(34, 211, 238, 0.25); color: #22d3ee; }
.bg-neon-magenta { background-color: rgba(217, 70, 239, 0.25); color: #d946ef; }
.bg-neon-emerald { background-color: rgba(16, 185, 129, 0.25); color: #10b981; }
.bg-neon-amber { background-color: rgba(245, 158, 11, 0.25); color: #f59e0b; }

.xlsx-cell.bg-neon-cyan .cell-input { color: #22d3ee; font-weight: 500; }
.xlsx-cell.bg-neon-magenta .cell-input { color: #d946ef; font-weight: 500; }
.xlsx-cell.bg-neon-emerald .cell-input { color: #10b981; font-weight: 500; }
.xlsx-cell.bg-neon-amber .cell-input { color: #f59e0b; font-weight: 500; }


/* ---- PDF WORKSPACE ---- */
.pdf-workspace {
  flex: 1;
  padding: 24px;
  background: #0f172a;
  display: flex;
  justify-content: center;
  overflow-y: auto;
}

.pdf-hologram-sheet {
  width: 100%;
  max-width: 680px;
  background: rgba(239, 68, 68, 0.02);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(239, 68, 68, 0.05);
  position: relative;
  overflow: hidden;
  text-align: left;
}

.pdf-deco-icon {
  width: 44px;
  height: 44px;
  color: #ef4444;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 6px #ef4444);
}

.pdf-doc-title {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.pdf-divider {
  width: 100%;
  height: 1px;
  background: rgba(239, 68, 68, 0.2);
  margin: 16px 0 24px 0;
}

.pdf-content-blocks h3 {
  font-size: 0.95rem;
  color: #ef4444;
  margin-top: 20px;
  margin-bottom: 8px;
}

.pdf-content-blocks p {
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
}

.pdf-watermark {
  display: block;
  text-align: center;
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: bold;
  color: rgba(239, 68, 68, 0.2);
  margin-top: 40px;
  letter-spacing: 1px;
}


/* ---- GENERAL SAVING TOAST ---- */
.save-toast {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(16, 185, 129, 0.9);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 6px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  opacity: 0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.toast-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(5px);
}

/* ── DIÁLOGO GUARDAR COMO AL ESTILO GNOME FILES ── */
.gnome-dialog-overlay {
  position: absolute;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
}

.gnome-dialog-card {
  width: 100%;
  max-width: 600px;
  height: 400px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.55),
    0 0 15px rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.gnome-dialog-header {
  height: 50px;
  background: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  width: 18px;
  height: 18px;
  color: #38bdf8;
}

.dialog-title {
  font-size: 0.95rem;
  font-weight: bold;
  color: #ffffff;
}

.dialog-close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px;
}

.dialog-close-btn:hover {
  color: #ffffff;
}

.gnome-dialog-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Sidebar de Carpetas */
.gnome-dialog-sidebar {
  width: 160px;
  background: #0f172a;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  user-select: none;
}

.sidebar-title {
  font-size: 0.72rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-left: 8px;
  margin-bottom: 4px;
}

.sidebar-folder-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.82rem;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-folder-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.active-folder {
  background: rgba(56, 189, 248, 0.1) !important;
  color: #38bdf8 !important;
}

.folder-btn-icon {
  width: 14px;
  height: 14px;
}

/* Contenido Principal (Visualización del Directorio) */
.gnome-dialog-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.content-header-path {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 8px;
}

.files-preview-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-preview-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.01);
}

.file-preview-icon {
  width: 16px;
  height: 16px;
}

.file-preview-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.file-preview-name {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.85);
}

.file-preview-size {
  font-size: 0.72rem;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.4);
}

.empty-preview-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

/* Pie de Página GNOME */
.gnome-dialog-footer {
  height: 70px;
  background: #0f172a;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.dialog-name-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialog-name-input-group label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.dialog-filename-input {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.8rem;
  padding: 6px 10px;
  width: 180px;
  outline: none;
}

.dialog-filename-input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.2);
}

.dialog-actions {
  display: flex;
  gap: 8px;
}

.btn-dialog-cancel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 6px 16px;
  cursor: pointer;
}

.btn-dialog-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-dialog-save {
  background: #38bdf8;
  border: 1px solid #38bdf8;
  border-radius: 6px;
  color: #0f172a;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 6px 16px;
  cursor: pointer;
}

.btn-dialog-save:hover {
  background: #0ea5e9;
  border-color: #0ea5e9;
}
</style>

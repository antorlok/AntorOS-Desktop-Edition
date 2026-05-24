<template>
  <div class="browser-root">
    <!-- ── Barra de Dirección ── -->
    <div class="address-bar">
      <!-- Botones de navegación nativa del webview -->
      <div class="nav-controls">
        <button
          id="browser-back-btn"
          class="nav-btn"
          title="Atrás"
          @click="goBack"
        >
          <ArrowLeft class="nav-icon" />
        </button>
        <button
          id="browser-forward-btn"
          class="nav-btn"
          title="Adelante"
          @click="goForward"
        >
          <ArrowRight class="nav-icon" />
        </button>
        <button
          id="browser-reload-btn"
          class="nav-btn"
          title="Recargar"
          @click="reload"
        >
          <RotateCw class="nav-icon" :class="{ spinning: isLoading }" />
        </button>
      </div>

      <!-- Campo de URL: inputUrl se actualiza libremente mientras se escribe.
           activeUrl sólo cambia al confirmar con Enter para evitar recargas prematuras. -->
      <div class="url-wrapper">
        <GlobeIcon class="url-icon" />
        <input
          id="browser-url-input"
          v-model="inputUrl"
          type="text"
          class="url-input"
          spellcheck="false"
          autocomplete="off"
          placeholder="Escribe una URL o búsqueda..."
          @keyup.enter="mapsToUrl"
          @focus="selectOnFocus"
        />
      </div>

      <!-- Botón Cazador de Fondos -->
      <button
        class="hunter-toggle-btn"
        :class="{ 'hunter-active': isHunterOpen }"
        @click="isHunterOpen = !isHunterOpen"
        title="Cazador de Fondos Cyber"
      >
        <DownloadCloudIcon class="hunter-btn-icon" />
        <span>Cazador de Fondos</span>
      </button>
    </div>

    <!-- Contenedor del motor de renderizado con posición relativa para forzar el redimensionamiento del Shadow DOM -->
    <div
      ref="containerRef"
      class="webview-container"
      :style="{ right: isHunterOpen ? '320px' : '0' }"
    >
      <webview
        ref="webviewRef"
        src="https://google.com"
        class="web-engine"
        allowpopups
        @did-start-loading="isLoading = true"
        @did-stop-loading="syncUrlFromWebview"
      ></webview>
    </div>

    <!-- ── Drawer Cazador de Fondos ── -->
    <aside
      class="hunter-drawer"
      :class="{ 'drawer-open': isHunterOpen }"
    >
      <header class="drawer-header">
        <CompassIcon class="drawer-header-icon" />
        <div>
          <h3 class="drawer-title">Cazador de Fondos</h3>
          <span class="drawer-subtitle">Descarga fondos gamer al sistema</span>
        </div>
      </header>

      <div class="drawer-body">
        <!-- Sección 1: Importar por URL -->
        <div class="drawer-section">
          <span class="section-label">Importar por URL Directa</span>
          <div class="paste-form">
            <input
              v-model="customUrl"
              type="text"
              class="drawer-input"
              placeholder="Pegar URL de la imagen (https://...)"
              spellcheck="false"
            />
            <input
              v-model="customFilename"
              type="text"
              class="drawer-input"
              placeholder="Nombre del archivo (ej. fondo-hacker)"
              spellcheck="false"
            />
            <button
              class="import-btn"
              @click="downloadCustomUrl"
              :disabled="!customUrl"
            >
              Descargar a Sistema
            </button>
          </div>
        </div>

        <div class="drawer-divider"></div>

        <!-- Sección 2: Fondos Sugeridos Unsplash -->
        <div class="drawer-section">
          <span class="section-label">Fondos Cyberpunk Sugeridos</span>
          <div class="suggestions-list">
            <div
              v-for="sug in suggestedWallpapers"
              :key="sug.name"
              class="sug-card"
            >
              <img :src="sug.url" class="sug-thumb" />
              <div class="sug-meta">
                <span class="sug-name">{{ sug.name }}</span>
                <button
                  class="sug-download-btn"
                  @click="downloadSuggested(sug)"
                >
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mensaje Toast de Guardado Rápido -->
    <div class="save-toast" :class="{ 'toast-visible': browserToast }">
      {{ browserToast }}
    </div>

    <!-- ── MENÚ CONTEXTUAL ESTILO CHROME (GLASSMORPHIC) ── -->
    <div
      v-if="isContextMenuOpen"
      class="custom-context-menu"
      :style="{ left: `${contextMenuPos.x}px`, top: `${contextMenuPos.y}px` }"
      @click.stop
    >
      <button class="menu-item" @click="setAsWallpaperFromUrl(contextMenuSrc)">
        <ImageIcon class="menu-item-icon" />
        <span>Establecer como fondo de pantalla</span>
      </button>
      <button class="menu-item" @click="downloadToDescargas(contextMenuSrc)">
        <DownloadCloudIcon class="menu-item-icon" />
        <span>Descargar a Descargas</span>
      </button>
      <button class="menu-item" @click="copyToClipboard(contextMenuSrc)">
        <CopyIcon class="menu-item-icon" />
        <span>Copiar dirección de imagen</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Globe as GlobeIcon,
  DownloadCloud as DownloadCloudIcon,
  Compass as CompassIcon,
  Image as ImageIcon,
  Copy as CopyIcon
} from 'lucide-vue-next';
import { useOSStore } from '@/stores/osStore';
import { useConfigStore } from '@/stores/configStore';
import { useAudioStore } from '@/stores/audioStore';

const osStore = useOSStore();
const configStore = useConfigStore();
const audioStore = useAudioStore();

// ── Estado del input de navegación ──
const inputUrl = ref('https://google.com');
const isLoading = ref(false);

// ── Estado de Cazador de Fondos ──
const isHunterOpen = ref(false);
const customUrl = ref('');
const customFilename = ref('');
const browserToast = ref('');

// ── Estado del Menú Contextual Chrome-Style ──
const isContextMenuOpen = ref(false);
const contextMenuPos = ref({ x: 0, y: 0 });
const contextMenuSrc = ref('');

const suggestedWallpapers = [
  {
    name: 'neon-shinjuku.jpg',
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200',
    size: '1.8 MB'
  },
  {
    name: 'cyber-artwork.jpg',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200',
    size: '2.1 MB'
  },
  {
    name: 'synthwave-grid.jpg',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200',
    size: '1.2 MB'
  },
  {
    name: 'neon-cyber-street.jpg',
    url: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=1200',
    size: '2.5 MB'
  }
];

function triggerBrowserToast(msg: string) {
  browserToast.value = msg;
  setTimeout(() => {
    browserToast.value = '';
  }, 4000);
}

function downloadSuggested(sug: { name: string; url: string; size: string }) {
  osStore.addFileToFolder('Descargas', {
    name: sug.name,
    type: 'file',
    size: sug.size,
    dataUrl: sug.url
  });
  triggerBrowserToast(`¡${sug.name} guardada en Descargas! Múevela en el Explorador a Imágenes para usarla.`);
}

// Descarga y valida la URL de imagen personalizada ingresada manualmente
function downloadCustomUrl() {
  const url = customUrl.value.trim();
  if (!url) return;

  if (!/^https?:\/\/.+/i.test(url)) {
    triggerBrowserToast('⚠️ Error: Ingresa una URL válida que inicie con http:// o https://');
    return;
  }

  triggerBrowserToast('🔍 Validando y descargando imagen...');

  const testImg = new Image();
  testImg.src = url;

  testImg.onload = () => {
    let name = customFilename.value.trim();
    if (!name) {
      name = `imagen-${Date.now()}`;
    }
    if (!name.endsWith('.jpg') && !name.endsWith('.png') && !name.endsWith('.jpeg')) {
      name += '.jpg';
    }

    osStore.addFileToFolder('Descargas', {
      name,
      type: 'file',
      size: '850 KB',
      dataUrl: url
    });

    triggerBrowserToast(`¡${name} guardada en Descargas! Múevela en el Explorador a Imágenes para usarla.`);
    customUrl.value = '';
    customFilename.value = '';
  };

  testImg.onerror = () => {
    triggerBrowserToast('⚠️ Error: No se pudo cargar la imagen. Verifica el enlace o CORS.');
  };
}

// Establece directamente la imagen como fondo de pantalla e inyecta al sistema
function setAsWallpaperFromUrl(url: string) {
  isContextMenuOpen.value = false;
  triggerBrowserToast('🔍 Validando imagen...');

  const testImg = new Image();
  testImg.src = url;

  testImg.onload = () => {
    const filename = `cyber-fondo-${Date.now().toString().slice(-4)}.jpg`;

    osStore.addFileToFolder('Imágenes', {
      name: filename,
      type: 'file',
      size: '1.2 MB',
      dataUrl: url
    });

    configStore.setWallpaper(url);
    triggerBrowserToast(`🚀 ¡Escritorio actualizado con éxito a "${filename}"!`);
  };

  testImg.onerror = () => {
    triggerBrowserToast('⚠️ Error CORS: El servidor remoto no permite descargas directas.');
  };
}

// Descarga una imagen desde el menú contextual
function downloadToDescargas(url: string) {
  isContextMenuOpen.value = false;
  triggerBrowserToast('🔍 Descargando...');

  const testImg = new Image();
  testImg.src = url;

  testImg.onload = () => {
    const filename = `descarga-web-${Date.now().toString().slice(-4)}.jpg`;

    osStore.addFileToFolder('Descargas', {
      name: filename,
      type: 'file',
      size: '980 KB',
      dataUrl: url
    });

    triggerBrowserToast(`¡${filename} guardada en Descargas! Múevela en el Explorador a Imágenes para usarla.`);
  };

  testImg.onerror = () => {
    triggerBrowserToast('⚠️ Error: El servidor remoto no permite descargas directas (CORS).');
  };
}

// Copia la dirección de la imagen al portapapeles
function copyToClipboard(text: string) {
  isContextMenuOpen.value = false;
  navigator.clipboard.writeText(text).then(() => {
    triggerBrowserToast('📋 Dirección de imagen copiada al portapapeles.');
  }).catch(() => {
    triggerBrowserToast('⚠️ Error al copiar al portapapeles.');
  });
}

// Cierra el menú contextual de la aplicación
function closeContextMenu() {
  isContextMenuOpen.value = false;
}

// Captura el evento clic derecho sobre el webview guest
function handleWebviewContextMenu(e: any) {
  const { params } = e;
  if (!params) return;

  if (params.mediaType === 'image' && params.srcURL) {
    e.preventDefault();
    contextMenuSrc.value = params.srcURL;
    contextMenuPos.value = {
      x: params.x,
      y: params.y + 42
    };
    isContextMenuOpen.value = true;
  }
}

// Ref tipada al elemento DOM del webview para acceder a su API nativa de Electron
const webviewRef = ref<Electron.WebviewTag | null>(null);

// Ref al contenedor para observar cambios de tamaño
const containerRef = ref<HTMLDivElement | null>(null);
let resizeObserver: ResizeObserver | null = null;

// ── Lógica de Navegación ──

/**
 * Normaliza la cadena del input y navega usando la API nativa de Electron.
 * Evita el uso de :src reactivo directo que causa bucles de redirección y ERR_ABORTED.
 */
function mapsToUrl() {
  const raw = inputUrl.value.trim();
  if (!raw) return;

  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  inputUrl.value = normalized;

  if (webviewRef.value) {
    webviewRef.value.loadURL(normalized);
  }
}

/**
 * Inyecta un script JS en el webview para sincronizar el volumen y silencio del host
 */
function syncVolumeToWebview() {
  const wv = webviewRef.value;
  if (!wv) return;

  const volumeVal = audioStore.isMuted ? 0 : audioStore.volume / 100;
  const isMutedVal = audioStore.isMuted;

  // Script seguro que busca y ajusta dinámicamente todo elemento multimedia en el guest
  const jsScript = `
    (function() {
      const mediaElements = document.querySelectorAll('video, audio');
      mediaElements.forEach(el => {
        el.volume = ${volumeVal};
        el.muted = ${isMutedVal};
      });
    })();
  `;

  wv.executeJavaScript(jsScript).catch((err) => {
    // Silenciar logs de advertencia de Chromium de carga asíncrona temprana
    console.debug('[BrowserApp WebView] Error synchronizing audio volume:', err);
  });
}

// Sincronizar reactivamente cuando el volumen o silencio cambia en Pinia
watch(
  () => [audioStore.volume, audioStore.isMuted],
  () => {
    syncVolumeToWebview();
  },
  { deep: true }
);

/**
 * Sincroniza la barra de URL después de que el webview termina de cargar.
 * Solo actualiza el input visible para el usuario, evitando forzar una
 * re-navegación cíclica en el webview de Electron.
 */
function syncUrlFromWebview() {
  isLoading.value = false;
  if (!webviewRef.value) return;
  const url = webviewRef.value.getURL();
  if (url && url !== 'about:blank') {
    inputUrl.value = url;
  }
  // Sincronizar volumen inmediatamente después de cargar una nueva página
  syncVolumeToWebview();
}

function goBack()    { webviewRef.value?.goBack(); }
function goForward() { webviewRef.value?.goForward(); }
function reload()    { webviewRef.value?.reload(); }

/** Selecciona todo el texto al enfocar para facilitar el reemplazo rápido de URL */
function selectOnFocus(e: FocusEvent) {
  (e.target as HTMLInputElement).select();
}

/**
 * Fuerza al <webview> a recalcular su viewport interno.
 * Electron no propaga automáticamente cambios de CSS al guest WebContents;
 * se necesita un "touch" en el estilo para que Chromium re-layout.
 */
function forceWebviewResize() {
  const wv = webviewRef.value;
  if (!wv) return;
  const { offsetWidth, offsetHeight } = wv;
  // Forzar un reflow asignando dimensiones explícitas en px
  wv.style.width = `${offsetWidth}px`;
  wv.style.height = `${offsetHeight}px`;
  // Restaurar al 100% en el siguiente frame para mantener la responsividad
  requestAnimationFrame(() => {
    wv.style.width = '100%';
    wv.style.height = '100%';
  });
}

onMounted(async () => {
  await nextTick();

  // Observar cambios de tamaño del contenedor para sincronizar el viewport del webview
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      forceWebviewResize();
    });
    resizeObserver.observe(containerRef.value);
  }

  // Escuchar el evento context-menu de Electron del webview guest
  if (webviewRef.value) {
    webviewRef.value.addEventListener('context-menu', handleWebviewContextMenu);
    // Sincronizar audio en cuanto el DOM del guest esté listo
    webviewRef.value.addEventListener('dom-ready', () => {
      syncVolumeToWebview();
    });
  }

  // Cerrar el menú contextual al hacer clic izquierdo en la ventana
  window.addEventListener('click', closeContextMenu);

  // Trigger inicial para forzar dimensiones después del primer render
  setTimeout(() => forceWebviewResize(), 200);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (webviewRef.value) {
    webviewRef.value.removeEventListener('context-menu', handleWebviewContextMenu);
  }
  window.removeEventListener('click', closeContextMenu);
});
</script>

<style scoped>
/*
 * Estrategia de Layout: posición absoluta con inset:0 para obtener
 * dimensiones reales en píxeles. El <webview> de Electron requiere
 * alturas resueltas (no porcentajes de flex) para que su Shadow DOM
 * dimensione correctamente el WebContents de Chromium.
 */
.browser-root {
  position: absolute;
  inset: 0; /* Ocupa todo el slot de WindowFrame.window-content */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface-base);
}

/* ── Barra de Dirección ── */
.address-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  flex-shrink: 0;
  padding: 0 12px;
  background: var(--surface-base);
  border-bottom: 1.5px solid var(--neon-cyan);
  box-shadow: 0 1px 12px rgba(0, 243, 255, 0.15);
  -webkit-app-region: no-drag;
}

/* Botones de control de navegación */
.nav-controls {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--neon-cyan);
  filter: drop-shadow(0 0 6px var(--neon-cyan));
}

.nav-icon {
  width: 16px;
  height: 16px;
}

/* Animación de carga en el botón de recargar */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinning {
  animation: spin 0.7s linear infinite;
}

/* Campo de URL */
.url-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
  height: 32px;
  padding: 0 16px;
  background: rgba(0, 243, 255, 0.03);
  border: 1px solid rgba(0, 243, 255, 0.18);
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.12), inset 0 0 8px rgba(0, 243, 255, 0.02);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.url-wrapper:focus-within {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 18px rgba(0, 243, 255, 0.35), inset 0 0 10px rgba(0, 243, 255, 0.08);
  background: rgba(0, 243, 255, 0.06);
}

.url-icon {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.url-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.82rem;
  color: #fff;
  letter-spacing: 0.3px;
}

.url-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

/*
 * El contenedor del webview usa posición absoluta anclada debajo
 * de la address-bar (42px). Esto le da dimensiones reales en px
 * que el Shadow DOM del <webview> puede resolver.
 */
.webview-container {
  position: absolute;
  top: 42px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/*
 * Motor Web Chromium — el <webview> de Electron tiene un Shadow DOM
 * interno que aplica sus propios estilos de dimensión. Se necesita
 * !important para forzar al guest renderer a respetar el layout
 * del contenedor padre en lugar de colapsar al default de 150px.
 */
.web-engine {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  border: none !important;
  background-color: #fff;
  display: inline-flex !important;
}

/* Botón Cazador de Fondos */
.hunter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 243, 255, 0.05);
  border: 1px solid rgba(0, 243, 255, 0.2);
  border-radius: 20px;
  padding: 4px 14px;
  color: var(--neon-cyan);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.hunter-toggle-btn:hover {
  background: rgba(0, 243, 255, 0.15);
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.25);
}

.hunter-active {
  background: var(--neon-cyan) !important;
  color: #050505 !important;
  border-color: var(--neon-cyan) !important;
  box-shadow: 0 0 12px rgba(0, 243, 255, 0.4);
}

.hunter-btn-icon {
  width: 14px;
  height: 14px;
}

/* Drawer Cazador de Fondos */
.hunter-drawer {
  position: absolute;
  top: 42px;
  right: -320px;
  width: 320px;
  bottom: 0;
  background: rgba(17, 17, 27, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1.5px solid var(--neon-cyan);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  padding: 20px;
  color: #cdd6f4;
  overflow-y: auto;
}

.drawer-open {
  right: 0 !important;
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.drawer-header-icon {
  width: 24px;
  height: 24px;
  color: var(--neon-cyan);
  filter: drop-shadow(0 0 5px var(--neon-cyan));
}

.drawer-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.3px;
}

.drawer-subtitle {
  font-size: 0.72rem;
  color: #a6adc8;
  display: block;
}

.drawer-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.drawer-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-size: 0.75rem;
  font-weight: bold;
  color: #89b4fa;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* Formulario */
.paste-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drawer-input {
  width: 100%;
  background: rgba(2, 6, 23, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.78rem;
  outline: none;
  transition: border-color 0.2s;
}

.drawer-input:focus {
  border-color: var(--neon-cyan);
}

.import-btn {
  background: rgba(0, 243, 255, 0.1);
  border: 1px solid rgba(0, 243, 255, 0.3);
  border-radius: 8px;
  padding: 8px;
  color: var(--neon-cyan);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.import-btn:hover:not(:disabled) {
  background: var(--neon-cyan);
  color: #11111b;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
}

.import-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.drawer-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
}

/* Sugeridos */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sug-card {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 8px;
  border-radius: 10px;
  align-items: center;
  transition: border-color 0.2s;
}

.sug-card:hover {
  border-color: rgba(0, 243, 255, 0.15);
}

.sug-thumb {
  width: 72px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.sug-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sug-name {
  font-size: 0.72rem;
  font-family: monospace;
  color: #cdd6f4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}

.sug-download-btn {
  background: #313244;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  color: var(--neon-cyan);
  font-family: inherit;
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
  width: fit-content;
  transition: all 0.2s;
}

.sug-download-btn:hover {
  background: var(--neon-cyan);
  color: #11111b;
  box-shadow: 0 0 8px rgba(0, 243, 255, 0.2);
}

/* Toast flotante */
.save-toast {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 243, 255, 0.85);
  backdrop-filter: blur(8px);
  color: #11111b;
  font-size: 0.78rem;
  font-weight: bold;
  padding: 8px 18px;
  border-radius: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 243, 255, 0.2);
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  text-align: center;
  max-width: 80%;
  line-height: 1.4;
}

.toast-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

/* ── MENÚ CONTEXTUAL ESTILO CHROME (GLASSMORPHIC) ── */
.custom-context-menu {
  position: absolute;
  background: rgba(17, 17, 27, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid var(--neon-cyan);
  border-radius: 10px;
  padding: 6px 0;
  width: 230px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 243, 255, 0.15);
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: #cdd6f4;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.menu-item:hover {
  background: rgba(0, 243, 255, 0.12);
  color: var(--neon-cyan);
}

.menu-item-icon {
  width: 14px;
  height: 14px;
  color: var(--neon-cyan);
}
</style>


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
    </div>

    <!-- Contenedor del motor de renderizado con posición relativa para forzar el redimensionamiento del Shadow DOM -->
    <div class="webview-container">
      <webview
        ref="webviewRef"
        src="https://google.com"
        class="web-engine"
        allowpopups
        @did-start-loading="isLoading = true"
        @did-stop-loading="syncUrlFromWebview"
      ></webview>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeft, ArrowRight, RotateCw, Globe as GlobeIcon } from 'lucide-vue-next';

// ── Estado del input de navegación ──
// inputUrl: refleja exactamente lo que el usuario ve/escribe en la barra.
const inputUrl = ref('https://google.com');
const isLoading = ref(false);

// Ref tipada al elemento DOM del webview para acceder a su API nativa de Electron
const webviewRef = ref<Electron.WebviewTag | null>(null);

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
}

function goBack()    { webviewRef.value?.goBack(); }
function goForward() { webviewRef.value?.goForward(); }
function reload()    { webviewRef.value?.reload(); }

/** Selecciona todo el texto al enfocar para facilitar el reemplazo rápido de URL */
function selectOnFocus(e: FocusEvent) {
  (e.target as HTMLInputElement).select();
}
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
  background: #ffffff;
}

/* ── Motor Web Chromium ── */
.web-engine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  background: #ffffff;
  display: block;
}
</style>


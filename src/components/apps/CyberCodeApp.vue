<template>
  <div class="editor-container">
    <!-- BARRA LATERAL DE ARCHIVOS (IDE STYLE) -->
    <aside class="editor-sidebar">
      <div class="sidebar-title">
        <FolderIcon class="sidebar-title-icon" />
        <span>PROYECTO</span>
      </div>
      <nav class="files-nav">
        <button
          v-for="file in files"
          :key="file.name"
          type="button"
          class="file-item"
          :class="{ 'file-item-active': file.name === activeFile.name }"
          @click="activeFile = file"
        >
          <CodeIcon class="file-icon" :class="file.colorClass" />
          <span>{{ file.name }}</span>
        </button>
      </nav>
    </aside>

    <!-- VENTANA DEL EDITOR DE CÓDIGO -->
    <main class="editor-main">
      <div class="editor-header">
        <div class="tab-title">
          <CodeIcon class="tab-icon" />
          <span>{{ activeFile.name }}</span>
        </div>
        <div class="editor-actions">
          <span class="language-badge">{{ activeFile.lang }}</span>
        </div>
      </div>

      <div class="editor-body">
        <!-- Números de Líneas -->
        <div class="line-numbers">
          <span v-for="line in activeFile.lines.length" :key="line">{{ line }}</span>
        </div>

        <!-- Área de Código Coloreado -->
        <div class="code-area">
          <pre class="code-pre" v-html="highlightCode(activeFile.code)"></pre>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Folder as FolderIcon, Code as CodeIcon } from 'lucide-vue-next';

interface ProjectFile {
  name: string;
  lang: string;
  colorClass: string;
  code: string;
  lines: number[];
}

const files: ProjectFile[] = [
  {
    name: 'main.go',
    lang: 'Go (Kernel)',
    colorClass: 'color-cyan',
    code: `package main

import (
\t"fmt"
\t"net/http"
\t"github.com/gorilla/websocket"
)

// AntorOS Kernel Daemon
func main() {
\tfmt.Println("[Kernel] Inicializando Daemon...")
\thttp.HandleFunc("/ws", handleWebSocket)
\thttp.ListenAndServe(":8080", nil)
}`,
    lines: Array.from({ length: 14 })
  },
  {
    name: 'App.vue',
    lang: 'Vue 3 (Frontend)',
    colorClass: 'color-green',
    code: `<template>
  <div class="desktop-environment">
    <Shell />
    <Desktop />
    <Taskbar v-if="dockEnabled" />
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore';
const configStore = useConfigStore();
<\/script>`,
    lines: Array.from({ length: 12 })
  },
  {
    name: 'styles.css',
    lang: 'CSS (Theme)',
    colorClass: 'color-magenta',
    code: `:root {
  --neon-cyan: #00f3ff;
  --neon-magenta: #ff00ff;
  --neon-green: #00ff66;
}

body {
  filter: brightness(var(--system-brightness));
  background: var(--bg-primary);
  font-family: 'Inter', sans-serif;
}`,
    lines: Array.from({ length: 12 })
  }
];

const activeFile = ref<ProjectFile>(files[0]);

// Resaltador de código simulado por expresiones regulares para simular cyberpunk IDE
function highlightCode(code: string): string {
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Coloreado simulado
  // Palabras clave (go, package, import, func, const, let, template, script)
  escaped = escaped.replace(
    /\b(package|import|func|func|return|type|struct|interface|const|let|import|from|v-if|v-for|export|default|class)\b/g,
    '<span class="keyword">$1</span>'
  );

  // Comentarios
  escaped = escaped.replace(
    /(\/\/.*)/g,
    '<span class="comment">$1</span>'
  );

  // Strings (comillas dobles y simples)
  escaped = escaped.replace(
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    '<span class="string">$1</span>'
  );

  // Funciones o tags
  escaped = escaped.replace(
    /\b(fmt\.Println|HandleFunc|ListenAndServe|template|script|div|Shell|Desktop|Taskbar)\b/g,
    '<span class="builtin">$1</span>'
  );

  return escaped;
}
</script>

<style scoped>
.editor-container {
  display: flex;
  width: 100%;
  height: 100%;
  background: #08080c;
  color: var(--text-primary);
  font-family: monospace;
  overflow: hidden;
  user-select: none;
}

/* SIDEBAR DEL IDE */
.editor-sidebar {
  width: 200px;
  background: #0f0f15;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  gap: 16px;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;
  font-size: 0.72rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
}

.sidebar-title-icon {
  width: 12px;
  height: 12px;
}

.files-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.78rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-item:hover {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
}

.file-item-active {
  background: rgba(0, 243, 255, 0.08) !important;
  color: var(--neon-cyan) !important;
  font-weight: bold;
}

.file-icon {
  width: 14px;
  height: 14px;
}

.color-cyan { color: var(--neon-cyan); }
.color-green { color: var(--neon-green); }
.color-magenta { color: var(--neon-magenta); }

/* CONTENIDO DEL EDITOR */
.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-header {
  height: 40px;
  background: #0b0b10;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.tab-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #ffffff;
}

.tab-icon {
  width: 14px;
  height: 14px;
  color: var(--neon-cyan);
}

.language-badge {
  font-size: 0.68rem;
  font-weight: bold;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

.editor-body {
  flex: 1;
  display: flex;
  overflow-y: auto;
  background: #08080c;
  padding: 16px 0;
}

.line-numbers {
  width: 44px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 12px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.8rem;
  line-height: 1.5;
  user-select: none;
}

.code-area {
  flex: 1;
  padding-left: 16px;
  overflow-x: auto;
}

.code-pre {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #c9d1d9;
}

/* COLORES DE RESALTADO SIMULADO */
:global(.keyword) {
  color: #ff7b72; /* keywords rojo */
  font-weight: bold;
}

:global(.comment) {
  color: #8b949e; /* comentarios gris */
  font-style: italic;
}

:global(.string) {
  color: var(--neon-green); /* strings verde neón */
  text-shadow: 0 0 4px rgba(0, 255, 102, 0.15);
}

:global(.builtin) {
  color: var(--neon-cyan); /* funciones cian */
  text-shadow: 0 0 4px rgba(0, 243, 255, 0.15);
}
</style>

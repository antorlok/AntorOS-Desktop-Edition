<template>
  <div class="app-placeholder notes-app">
    <div class="app-header">
      <FileTextIcon class="app-header-icon" />
      <div>
        <h2 class="app-title">Editor de Notas Cyber</h2>
        <span class="app-subtitle">Cuaderno de apuntes encriptado</span>
      </div>
    </div>
    <div class="editor-body">
      <textarea
        class="cyber-textarea"
        placeholder="Escribe tus notas encriptadas aquí... [Guardado automático activo en IndexedDB]"
        spellcheck="false"
      ></textarea>
    </div>
    <div class="editor-footer">
      <span>Caracteres: 0</span>
      <span>Clave de cifrado: AES-256-GCM</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText as FileTextIcon } from 'lucide-vue-next';
</script>

<style scoped>
.app-placeholder {
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

.app-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(2, 6, 23, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.app-header-icon {
  width: 32px;
  height: 32px;
  color: #22d3ee;
  filter: drop-shadow(0 0 6px #22d3ee);
}

.app-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
}

.app-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

.editor-body {
  flex: 1;
  padding: 20px;
}

.cyber-textarea {
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: all 0.3s ease;
}

.cyber-textarea:focus {
  border-color: #22d3ee;
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.15), inset 0 0 8px rgba(34, 211, 238, 0.02);
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  padding: 0 20px;
  background: rgba(2, 6, 23, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}
</style>

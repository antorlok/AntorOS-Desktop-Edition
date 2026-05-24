<template>
  <div class="notes-container">
    <!-- Sidebar izquierdo: Listado de Notas -->
    <aside class="notes-sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">Apuntes</span>
        <button class="add-note-btn" @click="createNewNote" title="Crear nueva nota">+</button>
      </div>

      <div class="notes-list">
        <div
          v-for="note in productivityStore.notes"
          :key="note.id"
          class="note-item"
          :class="{ 'active-note': productivityStore.activeNoteId === note.id }"
          @click="productivityStore.activeNoteId = note.id"
        >
          <div class="note-item-meta">
            <FileTextIcon class="note-icon" />
            <span class="note-item-title">{{ note.title || 'Nota Nueva' }}</span>
          </div>
          <button
            class="delete-note-btn"
            @click.stop="deleteNote(note.id)"
            title="Eliminar nota"
          >
            ×
          </button>
        </div>
      </div>
    </aside>

    <!-- Área de Trabajo Derecha: Editor de Contenido -->
    <main class="notes-editor-area">
      <template v-if="activeNote">
        <!-- Cabecera del Editor -->
        <div class="editor-header">
          <span class="note-title-display">{{ activeNote.title || 'Nota Nueva' }}</span>
          <span class="note-char-count">Caracteres: {{ activeNote.content.length }}</span>
        </div>

        <!-- Textarea del cuerpo de la nota -->
        <div class="editor-body">
          <textarea
            :value="activeNote.content"
            @input="handleNoteInput"
            class="note-textarea"
            placeholder="Escribe tus pensamientos o notas aquí (auto-guardado activo)..."
            spellcheck="false"
          ></textarea>
        </div>
      </template>

      <!-- Estado vacío (Fallback de seguridad) -->
      <div v-else class="empty-editor-state">
        <FileTextIcon class="empty-icon" />
        <span>Selecciona o crea una nota para empezar</span>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProductivityStore } from '@/stores/productivityStore';
import { FileText as FileTextIcon } from 'lucide-vue-next';

const productivityStore = useProductivityStore();

// Computed para obtener la nota activa desde el store de Pinia
const activeNote = computed(() => {
  return productivityStore.notes.find((n) => n.id === productivityStore.activeNoteId) || null;
});

function createNewNote() {
  productivityStore.createNote();
}

function handleNoteInput(event: Event) {
  if (activeNote.value) {
    const val = (event.target as HTMLTextAreaElement).value;
    productivityStore.updateNote(activeNote.value.id, val);
  }
}

function deleteNote(id: string) {
  productivityStore.deleteNote(id);
}
</script>

<style scoped>
.notes-container {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-family-base);
  overflow: hidden;
  user-select: none;
}

/* Sidebar izquierdo */
.notes-sidebar {
  width: 190px;
  background: var(--bg-secondary);
  border-right: var(--glass-border);
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  gap: 12px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
}

.sidebar-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-note-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--bg-primary);
  border: var(--glass-border);
  border-radius: 4px;
  color: var(--neon-cyan);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
}

.add-note-btn:hover {
  background: var(--neon-cyan);
  color: #11111b;
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  flex: 1;
}

.note-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.note-item:hover {
  background: rgba(255, 255, 255, 0.03);
  color: var(--neon-cyan);
}

.active-note {
  background: rgba(0, 243, 255, 0.08) !important;
  color: var(--neon-cyan) !important;
  border-color: var(--glass-border) !important;
  box-shadow: var(--glow-cyan);
}

.note-item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.note-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.note-item-title {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-note-btn {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
  padding: 0 2px;
  transition: color 0.2s ease;
}

.delete-note-btn:hover {
  color: #f43f5e;
}

/* Área de Trabajo / Editor */
.notes-editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--bg-secondary);
  border-bottom: var(--glass-border);
}

.note-title-display {
  font-size: 1.05rem;
  font-weight: bold;
  color: var(--text-primary);
  width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-char-count {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.editor-body {
  flex: 1;
  padding: 20px;
  background: var(--bg-primary);
}

.note-textarea {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.note-textarea::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

.empty-editor-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 1;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.empty-icon {
  width: 44px;
  height: 44px;
  color: var(--text-secondary);
  opacity: 0.3;
}
</style>

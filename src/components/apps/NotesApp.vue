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
          v-for="note in notes"
          :key="note.id"
          class="note-item"
          :class="{ 'active-note': activeNoteId === note.id }"
          @click="activeNoteId = note.id"
        >
          <div class="note-item-meta">
            <FileTextIcon class="note-icon" />
            <span class="note-item-title">{{ note.title || 'Sin título' }}</span>
          </div>
          <button
            v-if="notes.length > 1"
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
        <!-- Input del título editable -->
        <div class="editor-header">
          <input
            v-model="activeNote.title"
            type="text"
            class="note-title-input"
            placeholder="Título de la nota..."
            spellcheck="false"
          />
          <span class="note-char-count">Caracteres: {{ activeNote.content.length }}</span>
        </div>

        <!-- Textarea del cuerpo de la nota -->
        <div class="editor-body">
          <textarea
            v-model="activeNote.content"
            class="note-textarea"
            placeholder="Escribe tus pensamientos o notas aquí..."
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
import { ref, computed } from 'vue';
import { FileText as FileTextIcon } from 'lucide-vue-next';

interface Note {
  id: string;
  title: string;
  content: string;
}

// Estado reactivo de las notas (DRY y persistente mientras viva la ventana)
const notes = ref<Note[]>([
  { id: '1', title: 'Nota 1', content: 'Contenido inicial de la nota de prueba.' },
  { id: '2', title: 'Ideas OS', content: '1. Mejorar el visor de imágenes.\n2. Añadir soporte para reproducción de video real en el Nautilus.\n3. Integrar atajos de teclado.' }
]);

const activeNoteId = ref('1');

const activeNote = computed(() => {
  return notes.value.find((n) => n.id === activeNoteId.value) || null;
});

function createNewNote() {
  const id = crypto.randomUUID();
  const newNote: Note = {
    id,
    title: `Nueva Nota`,
    content: ''
  };
  notes.value.push(newNote);
  activeNoteId.value = id;
}

function deleteNote(id: string) {
  if (notes.value.length <= 1) return;

  const index = notes.value.findIndex((n) => n.id === id);
  notes.value = notes.value.filter((n) => n.id !== id);

  // Si eliminamos la activa, enfocar otra
  if (activeNoteId.value === id) {
    const nextActiveIndex = Math.max(0, index - 1);
    activeNoteId.value = notes.value[nextActiveIndex]?.id || '';
  }
}
</script>

<style scoped>
.notes-container {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(10, 15, 30, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

/* Sidebar izquierdo */
.notes-sidebar {
  width: 180px;
  background: rgba(2, 6, 23, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
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
  font-size: 0.9rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-note-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.25);
  border-radius: 4px;
  color: #22d3ee;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
}

.add-note-btn:hover {
  background: rgba(34, 211, 238, 0.2);
  border-color: #22d3ee;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.2);
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
  color: #22d3ee;
}

.active-note {
  background: rgba(34, 211, 238, 0.08) !important;
  color: #22d3ee !important;
  border-color: rgba(34, 211, 238, 0.2) !important;
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
  color: rgba(255, 255, 255, 0.3);
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
  background: rgba(2, 6, 23, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.note-title-input {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffffff;
  outline: none;
  width: 70%;
}

.note-title-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.note-char-count {
  font-family: monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
}

.editor-body {
  flex: 1;
  padding: 20px;
  background: rgba(10, 15, 30, 0.1);
}

.note-textarea {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.note-textarea::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

.empty-editor-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 1;
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.95rem;
}

.empty-icon {
  width: 44px;
  height: 44px;
}
</style>

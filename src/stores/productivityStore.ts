import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  date: string;       // Formato: 'YYYY-MM-DD'
  title: string;
  description: string;
}

export const useProductivityStore = defineStore('productivity', () => {
  // ---- Inicializar datos del localStorage o usar arrays vacíos ----
  const savedData = localStorage.getItem('antorui-productivity');
  let initialNotes: Note[] = [
    {
      id: '1',
      title: 'Ideas del OS',
      content: 'Ideas del OS\n1. Optimizar los Toggles de interfaz.\n2. Conectar las aplicaciones a la persistencia local Pinia.\n3. Habilitar la personalización del Dock.',
      updatedAt: new Date().toISOString()
    }
  ];
  let initialEvents: CalendarEvent[] = [];

  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (parsed.notes) initialNotes = parsed.notes;
      if (parsed.events) initialEvents = parsed.events;
    } catch (e) {
      console.error('Error al parsear datos de productividad guardados:', e);
    }
  }

  // ---- Estados Reactivos ----
  const notes = ref<Note[]>(initialNotes);
  const activeNoteId = ref<string | null>(notes.value[0]?.id || null);
  const events = ref<CalendarEvent[]>(initialEvents);

  // ---- Watcher profundo para persistencia automática ----
  watch(
    [notes, events],
    () => {
      localStorage.setItem(
        'antorui-productivity',
        JSON.stringify({
          notes: notes.value,
          events: events.value
        })
      );
    },
    { deep: true }
  );

  // ---- Acciones de Notas ----
  function createNote() {
    const id = crypto.randomUUID();
    const newNote: Note = {
      id,
      title: 'Nota Nueva',
      content: '',
      updatedAt: new Date().toISOString()
    };
    notes.value.push(newNote);
    activeNoteId.value = id;
  }

  function updateNote(id: string, content: string) {
    const note = notes.value.find((n) => n.id === id);
    if (note) {
      note.content = content;
      note.updatedAt = new Date().toISOString();

      // Generar título dinámico en base al primer renglón del contenido
      const lines = content.split('\n');
      const firstLine = lines[0]?.trim();
      if (firstLine) {
        note.title = firstLine.slice(0, 20) + (firstLine.length > 20 ? '...' : '');
      } else {
        note.title = 'Nota Nueva';
      }
    }
  }

  function deleteNote(id: string) {
    const index = notes.value.findIndex((n) => n.id === id);
    if (index === -1) return;

    notes.value.splice(index, 1);

    // Ajustar el foco de la nota activa al eliminarla
    if (activeNoteId.value === id) {
      if (notes.value.length > 0) {
        const nextActiveIndex = Math.max(0, index - 1);
        activeNoteId.value = notes.value[nextActiveIndex]?.id || null;
      } else {
        activeNoteId.value = null;
      }
    }
  }

  // ---- Acciones de Calendario ----
  function addEvent(date: string, title: string, description = '') {
    const id = crypto.randomUUID();
    const newEvent: CalendarEvent = {
      id,
      date,
      title: title.trim(),
      description: description.trim()
    };
    events.value.push(newEvent);
  }

  function deleteEvent(id: string) {
    events.value = events.value.filter((ev) => ev.id !== id);
  }

  return {
    notes,
    activeNoteId,
    events,
    createNote,
    updateNote,
    deleteNote,
    addEvent,
    deleteEvent
  };
});

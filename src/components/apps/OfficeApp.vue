<template>
  <div class="app-placeholder office-app">
    <div class="app-header">
      <BookOpenIcon class="app-header-icon" />
      <div>
        <h2 class="app-title">Suite de Oficina Holográfica</h2>
        <span class="app-subtitle">Gestor de documentos y planillas integrado</span>
      </div>
    </div>
    <div class="office-body">
      <!-- Grid de planillas simuladas / Cyberpunk Spreadsheet structure -->
      <div class="spreadsheet-simulator">
        <div class="grid-headers">
          <div class="grid-cell cell-header"></div>
          <div v-for="col in cols" :key="col" class="grid-cell cell-header">{{ col }}</div>
        </div>
        <div v-for="row in rows" :key="row" class="grid-row">
          <div class="grid-cell cell-header cell-row-num">{{ row }}</div>
          <div v-for="col in cols" :key="col" class="grid-cell">
            <input
              type="text"
              class="cell-input"
              :value="getCellValue(row, col)"
              placeholder=""
              spellcheck="false"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="office-footer">
      <span>Hoja 1 de 1</span>
      <span>Modo: Edición Colaborativa</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen as BookOpenIcon } from 'lucide-vue-next';

const cols = ['A', 'B', 'C', 'D', 'E'];
const rows = [1, 2, 3, 4, 5, 6, 7];

function getCellValue(row: number, col: string): string {
  if (row === 1 && col === 'A') return 'PROYECTO';
  if (row === 1 && col === 'B') return 'ESTADO';
  if (row === 1 && col === 'C') return 'PRESUPUESTO';
  
  if (row === 2 && col === 'A') return 'AntorOS-Desktop';
  if (row === 2 && col === 'B') return 'Estable';
  if (row === 2 && col === 'C') return '$45,000';

  if (row === 3 && col === 'A') return 'Go-Daemon';
  if (row === 3 && col === 'B') return 'Desplegado';
  if (row === 3 && col === 'C') return '$28,000';

  if (row === 4 && col === 'A') return 'Vue-Frontend';
  if (row === 4 && col === 'B') return 'En diseño';
  if (row === 4 && col === 'C') return '$15,000';

  return '';
}
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
  color: #10b981;
  filter: drop-shadow(0 0 6px #10b981);
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

.office-body {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

/* Spreadsheet simulator style */
.spreadsheet-simulator {
  width: 100%;
  border-collapse: collapse;
  background: rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.grid-headers,
.grid-row {
  display: flex;
  width: 100%;
}

.grid-headers {
  background: rgba(2, 6, 23, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.grid-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.grid-cell {
  flex: 1;
  min-width: 80px;
  height: 28px;
  border-right: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell-header {
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(2, 6, 23, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  user-select: none;
}

.cell-row-num {
  max-width: 40px;
  min-width: 40px;
}

.grid-headers .cell-header:first-child {
  max-width: 40px;
  min-width: 40px;
}

.cell-input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  padding: 0 8px;
  color: #ffffff;
  font-size: 0.8rem;
  font-family: monospace;
  outline: none;
  transition: all 0.2s ease;
}

.cell-input:focus {
  background: rgba(16, 185, 129, 0.08);
  box-shadow: inset 0 0 4px rgba(16, 185, 129, 0.2);
}

.office-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  padding: 0 20px;
  background: rgba(2, 6, 23, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}
</style>

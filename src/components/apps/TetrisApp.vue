<template>
  <div class="tetris-app">
    <!-- Panel de control de puntuación superior -->
    <div class="hud-panel">
      <div class="score-box">
        PUNTOS: <span class="score-num">{{ score }}</span>
      </div>
      <div v-if="gameOver" class="game-over-tag">
        FIN DEL JUEGO
      </div>
      <div v-else class="game-active-tag">
        CYBER BLOCKS
      </div>
    </div>

    <!-- Tablero de renderizado visual 10x20 -->
    <div class="game-container">
      <div class="tetris-board">
        <div
          v-for="cellIndex in 200"
          :key="cellIndex"
          class="grid-cell"
          :class="getCellClass((cellIndex - 1) % 10, Math.floor((cellIndex - 1) / 10))"
        ></div>
      </div>

      <!-- Pantalla flotante de Game Over -->
      <Transition name="fade">
        <div v-if="gameOver" class="game-over-screen">
          <h3 class="game-over-title">CONEXIÓN PERDIDA</h3>
          <p class="game-over-subtitle">Los bloques se han desbordado del núcleo.</p>
          <button class="btn-restart" @click="resetGame">Reiniciar</button>
        </div>
      </Transition>
    </div>

    <!-- Guía rápida de controles inferior -->
    <div class="controls-panel">
      <div class="control-key"><span>←</span><span>→</span> Mover</div>
      <div class="control-key"><span>↑</span> Rotar</div>
      <div class="control-key"><span>↓</span> Caída</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// ---- Configuración y Estructura de Datos ----
const ROWS = 20;
const COLS = 10;

// Definición de las 7 piezas clásicas de Tetris
const SHAPES = {
  I: {
    matrix: [[1, 1, 1, 1]],
    color: 'cyan'
  },
  J: {
    matrix: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 'blue'
  },
  L: {
    matrix: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 'orange'
  },
  O: {
    matrix: [
      [1, 1],
      [1, 1]
    ],
    color: 'yellow'
  },
  S: {
    matrix: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 'green'
  },
  T: {
    matrix: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'magenta'
  },
  Z: {
    matrix: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 'red'
  }
};

type PieceColor = 'cyan' | 'blue' | 'orange' | 'yellow' | 'green' | 'magenta' | 'red';

interface ActivePiece {
  matrix: number[][];
  color: PieceColor;
  x: number;
  y: number;
}

// ---- Estado Reactivo ----
const board = ref<(PieceColor | null)[][]>(
  Array.from({ length: ROWS }, () => Array(COLS).fill(null))
);
const currentPiece = ref<ActivePiece>({
  matrix: SHAPES.I.matrix,
  color: 'cyan',
  x: 3,
  y: 0
});
const score = ref<number>(0);
const gameOver = ref<boolean>(false);

let gameInterval: number | null = null;

/**
 * Genera una pieza aleatoria en la parte superior central.
 */
function spawnPiece() {
  const keys = Object.keys(SHAPES) as (keyof typeof SHAPES)[];
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  const shape = SHAPES[randKey];

  const newPiece: ActivePiece = {
    matrix: shape.matrix,
    color: shape.color as PieceColor,
    x: Math.floor((COLS - shape.matrix[0].length) / 2),
    y: 0
  };

  // Validar colisión inmediata al nacer (fin del juego)
  if (checkCollision(newPiece.x, newPiece.y, newPiece.matrix)) {
    gameOver.value = true;
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = null;
    }
  } else {
    currentPiece.value = newPiece;
  }
}

/**
 * Comprueba si hay colisión para una coordenada y matriz específicas.
 */
function checkCollision(px: number, py: number, matrix: number[][]): boolean {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c]) {
        const boardX = px + c;
        const boardY = py + r;

        // Límites laterales e inferior
        if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
          return true;
        }

        // Colisión con bloques consolidados
        if (boardY >= 0 && board.value[boardY][boardX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Transpone y revierte la matriz para rotar 90 grados en el sentido de las agujas del reloj.
 */
function rotateMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const m = matrix[0].length;
  const rotated = Array.from({ length: m }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      rotated[c][n - 1 - r] = matrix[r][c];
    }
  }
  return rotated;
}

/**
 * Intenta rotar la pieza aplicando "Wall Kick" básico.
 */
function rotatePiece() {
  if (gameOver.value) return;
  const newMatrix = rotateMatrix(currentPiece.value.matrix);

  // 1. Probar en la posición actual
  if (!checkCollision(currentPiece.value.x, currentPiece.value.y, newMatrix)) {
    currentPiece.value.matrix = newMatrix;
    return;
  }

  // 2. Wall Kick a la izquierda
  if (!checkCollision(currentPiece.value.x - 1, currentPiece.value.y, newMatrix)) {
    currentPiece.value.x -= 1;
    currentPiece.value.matrix = newMatrix;
    return;
  }

  // 3. Wall Kick a la derecha
  if (!checkCollision(currentPiece.value.x + 1, currentPiece.value.y, newMatrix)) {
    currentPiece.value.x += 1;
    currentPiece.value.matrix = newMatrix;
    return;
  }
}

/**
 * Mueve la pieza lateralmente.
 */
function movePiece(dir: number) {
  if (gameOver.value) return;
  const nextX = currentPiece.value.x + dir;
  if (!checkCollision(nextX, currentPiece.value.y, currentPiece.value.matrix)) {
    currentPiece.value.x = nextX;
  }
}

/**
 * Empuja la pieza activa hacia abajo (Gravedad).
 * Si hay colisión, consolida la pieza, valida líneas y crea una nueva.
 */
function moveDown() {
  if (gameOver.value) return;
  const nextY = currentPiece.value.y + 1;

  if (!checkCollision(currentPiece.value.x, nextY, currentPiece.value.matrix)) {
    currentPiece.value.y = nextY;
  } else {
    freezePiece();
    clearLines();
    spawnPiece();
  }
}

/**
 * Consolida la pieza activa en la matriz estática del tablero.
 */
function freezePiece() {
  const p = currentPiece.value;
  for (let r = 0; r < p.matrix.length; r++) {
    for (let c = 0; c < p.matrix[r].length; c++) {
      if (p.matrix[r][c]) {
        const boardY = p.y + r;
        const boardX = p.x + c;
        if (boardY >= 0 && boardY < ROWS) {
          board.value[boardY][boardX] = p.color;
        }
      }
    }
  }
}

/**
 * Verifica y elimina las filas completas agregando filas vacías arriba.
 */
function clearLines() {
  let linesCleared = 0;

  for (let r = ROWS - 1; r >= 0; r--) {
    const isFull = board.value[r].every((cell) => cell !== null);
    if (isFull) {
      board.value.splice(r, 1);
      board.value.unshift(Array(COLS).fill(null));
      linesCleared++;
      r++; // Corregir índice por mutación del array
    }
  }

  if (linesCleared > 0) {
    // 100 puntos por línea eliminada
    score.value += linesCleared * 100;
  }
}

/**
 * Resuelve y retorna las clases de color de neón de cada celda.
 */
function getCellClass(x: number, y: number): string {
  // 1. Verificar si hay un bloque consolidado en el tablero
  if (board.value[y][x] !== null) {
    return `block-${board.value[y][x]}`;
  }

  // 2. Verificar si coincide con la pieza activa en movimiento
  const p = currentPiece.value;
  const pieceRow = y - p.y;
  const pieceCol = x - p.x;

  if (
    pieceRow >= 0 &&
    pieceRow < p.matrix.length &&
    pieceCol >= 0 &&
    pieceCol < p.matrix[pieceRow].length
  ) {
    if (p.matrix[pieceRow][pieceCol]) {
      return `block-${p.color}`;
    }
  }

  return '';
}

/**
 * Captura e interpreta el teclado global.
 */
function handleKeydown(e: KeyboardEvent) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  if (gameOver.value) return;

  switch (e.key) {
    case 'ArrowLeft':
      movePiece(-1);
      break;
    case 'ArrowRight':
      movePiece(1);
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowUp':
      rotatePiece();
      break;
  }
}

/**
 * Restablece todo el juego limpio de forma reactiva.
 */
function resetGame() {
  board.value = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  score.value = 0;
  gameOver.value = false;
  spawnPiece();

  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = window.setInterval(moveDown, 500);
}

// ---- Ciclo de Vida ----
onMounted(() => {
  spawnPiece();
  window.addEventListener('keydown', handleKeydown);
  gameInterval = window.setInterval(moveDown, 500);
});

onUnmounted(() => {
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.tetris-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-family-base);
  padding: 16px;
  box-sizing: border-box;
  user-select: none;
}

/* Panel superior HUD */
.hud-panel {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-weight: bold;
}

.score-box {
  background: rgba(255, 255, 255, 0.04);
  border: var(--glass-border);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
}

.score-num {
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
}

.game-over-tag {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  letter-spacing: 1px;
}

.game-active-tag {
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
  font-size: 0.9rem;
  letter-spacing: 1px;
}

/* Contenedor central del juego */
.game-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 12px 0;
}

.tetris-board {
  display: grid;
  grid-template-columns: repeat(10, 25px);
  grid-template-rows: repeat(20, 25px);
  gap: 1px;
  background: rgba(0, 0, 0, 0.7);
  border: var(--glass-border);
  border-radius: 10px;
  padding: 4px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.9);
}

/* Celdas del Grid */
.grid-cell {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 2px;
}

/* Paleta de Colores de Piezas Neón */
.block-cyan {
  background: var(--neon-cyan) !important;
  box-shadow: var(--glow-cyan);
}

.block-yellow {
  background: #ffea00 !important;
  box-shadow: 0 0 8px rgba(255, 234, 0, 0.6);
}

.block-magenta {
  background: var(--neon-magenta) !important;
  box-shadow: var(--glow-magenta);
}

.block-orange {
  background: #ff9f00 !important;
  box-shadow: 0 0 8px rgba(255, 159, 0, 0.6);
}

.block-green {
  background: var(--neon-green) !important;
  box-shadow: var(--glow-green);
}

.block-blue {
  background: #0066ff !important;
  box-shadow: 0 0 8px rgba(0, 102, 255, 0.6);
}

.block-red {
  background: #ff0055 !important;
  box-shadow: 0 0 8px rgba(255, 0, 85, 0.6);
}

/* Pantalla de Game Over flotante */
.game-over-screen {
  position: absolute;
  inset: 0;
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 0, 255, 0.2);
}

.game-over-title {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
}

.game-over-subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.btn-restart {
  background: var(--neon-magenta);
  border: 1px solid var(--neon-magenta);
  color: #ffffff;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 8px 24px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: var(--glow-magenta);
  transition: all 0.2s ease;
  outline: none;
}

.btn-restart:hover {
  background: transparent;
  color: var(--neon-magenta);
  box-shadow: 0 0 12px var(--neon-magenta);
}

/* Panel inferior de guía rápida */
.controls-panel {
  display: flex;
  justify-content: space-around;
  width: 100%;
  font-size: 0.72rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  padding: 6px 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.control-key span {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-weight: bold;
  margin-right: 2px;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

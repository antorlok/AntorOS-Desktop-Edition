<template>
  <div class="tictactoe-app">
    <!-- Selector de Modo de Juego estilo Cyberpunk -->
    <div class="mode-selector">
      <button
        class="mode-btn"
        :class="{ active: gameMode === 'vs_bot' }"
        @click="setGameMode('vs_bot')"
      >
        Vs Bot
      </button>
      <button
        class="mode-btn"
        :class="{ active: gameMode === '1v1' }"
        @click="setGameMode('1v1')"
      >
        1v1 Local
      </button>
    </div>

    <!-- Panel superior de estado / título -->
    <div class="status-panel">
      <h2 v-if="winner" class="neon-winner">
        ¡Ganador: <span :class="winner === 'X' ? 'text-x' : 'text-o'">{{ winner }}</span>!
      </h2>
      <h2 v-else-if="isDraw" class="neon-draw">
        ¡Empate!
      </h2>
      <h2 v-else class="neon-turn">
        <span v-if="isBotThinking" class="text-bot-thinking">El bot está pensando...</span>
        <span v-else>
          Turno de: <span :class="currentPlayer === 'X' ? 'text-x' : 'text-o'">{{ currentPlayer }}</span>
        </span>
      </h2>
    </div>

    <!-- Cuadrícula 3x3 del juego -->
    <div class="grid-container">
      <div class="board-grid" :class="{ 'board-disabled': isBotThinking }">
        <div
          v-for="(cell, index) in board"
          :key="index"
          class="cell"
          :class="{ 'cell-occupied': cell !== null }"
          @click="makeMove(index)"
        >
          <span
            v-if="cell"
            :class="cell === 'X' ? 'neon-x' : 'neon-o'"
          >
            {{ cell }}
          </span>
        </div>
      </div>
    </div>

    <!-- Botón de Reiniciar Partida (Visible al terminar) -->
    <div class="action-panel">
      <Transition name="fade">
        <button
          v-if="winner || isDraw"
          class="btn-reset"
          @click="resetGame"
        >
          Reiniciar Partida
        </button>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// ---- Estado Reactivo ----
const board = ref<(string | null)[]>(Array(9).fill(null));
const currentPlayer = ref<'X' | 'O'>('X');
const winner = ref<string | null>(null);
const isDraw = ref<boolean>(false);

// Configuración de Modos de Juego
const gameMode = ref<'1v1' | 'vs_bot'>('vs_bot');
const isBotThinking = ref<boolean>(false);

// Combinaciones de victoria posibles en un tablero de 3x3
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
  [0, 4, 8], [2, 4, 6]             // Diagonales
];

/**
 * Cambia el modo de juego actual y limpia el estado para una nueva partida.
 */
function setGameMode(mode: '1v1' | 'vs_bot') {
  gameMode.value = mode;
  resetGame();
}

/**
 * Evalúa si la jugada actual cumple las condiciones de victoria o empate.
 */
function evaluateGameState(): boolean {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (
      board.value[a] &&
      board.value[a] === board.value[b] &&
      board.value[a] === board.value[c]
    ) {
      winner.value = board.value[a];
      return true;
    }
  }

  // Si todas las celdas están ocupadas y no hay ganador
  if (board.value.every((cell) => cell !== null)) {
    isDraw.value = true;
    return true;
  }

  return false;
}

/**
 * Ejecuta el turno del Bot de forma inteligente, usando un algoritmo predecible 
 * que a veces se equivoca intencionalmente (deja ganar) para mejorar la jugabilidad.
 */
function makeBotMove() {
  if (winner.value || isDraw.value) {
    isBotThinking.value = false;
    return;
  }

  // Filtrar los índices de casillas vacías disponibles
  const availableIndices: number[] = [];
  board.value.forEach((cell, idx) => {
    if (cell === null) availableIndices.push(idx);
  });

  if (availableIndices.length === 0) {
    isBotThinking.value = false;
    return;
  }

  let chosenIndex = -1;

  // 35% de probabilidad de error / jugada aleatoria (deja ganar intencionalmente)
  const isErroneous = Math.random() < 0.35;

  if (isErroneous) {
    // Seleccionar una casilla completamente al azar
    const randIdx = Math.floor(Math.random() * availableIndices.length);
    chosenIndex = availableIndices[randIdx];
  } else {
    // Algoritmo predictivo heurístico

    // 1. Intentar ganar en este turno si es posible
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      const cells = [board.value[a], board.value[b], board.value[c]];
      const oCount = cells.filter((c) => c === 'O').length;
      const nullCount = cells.filter((c) => c === null).length;
      if (oCount === 2 && nullCount === 1) {
        chosenIndex = combo[cells.indexOf(null)];
        break;
      }
    }

    // 2. Si no se puede ganar, intentar bloquear la victoria inmediata del jugador ('X')
    if (chosenIndex === -1) {
      for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        const cells = [board.value[a], board.value[b], board.value[c]];
        const xCount = cells.filter((c) => c === 'X').length;
        const nullCount = cells.filter((c) => c === null).length;
        if (xCount === 2 && nullCount === 1) {
          chosenIndex = combo[cells.indexOf(null)];
          break;
        }
      }
    }

    // 3. Selección por patrón altamente predecible (Centro -> Primera Esquina -> Primer Lateral)
    if (chosenIndex === -1) {
      if (board.value[4] === null) {
        chosenIndex = 4; // Centro
      } else {
        const corners = [0, 2, 6, 8];
        const emptyCorners = corners.filter((idx) => board.value[idx] === null);
        if (emptyCorners.length > 0) {
          chosenIndex = emptyCorners[0]; // Patrón: siempre prefiere la esquina superior izquierda si está libre
        } else {
          const sides = [1, 3, 5, 7];
          const emptySides = sides.filter((idx) => board.value[idx] === null);
          if (emptySides.length > 0) {
            chosenIndex = emptySides[0];
          }
        }
      }
    }
  }

  // Salvaguarda final en caso de fallo algorítmico inesperado
  if (chosenIndex === -1 && availableIndices.length > 0) {
    chosenIndex = availableIndices[0];
  }

  // Ejecutar el movimiento del bot
  if (chosenIndex !== -1) {
    board.value[chosenIndex] = 'O';
    evaluateGameState();
    if (!winner.value && !isDraw.value) {
      currentPlayer.value = 'X';
    }
  }

  isBotThinking.value = false;
}

/**
 * Realiza un movimiento en la celda indicada.
 */
function makeMove(index: number) {
  // Evitar jugar en celdas ocupadas, si es turno del bot, o si el juego terminó
  if (
    board.value[index] ||
    winner.value ||
    isDraw.value ||
    isBotThinking.value ||
    (gameMode.value === 'vs_bot' && currentPlayer.value === 'O')
  ) {
    return;
  }

  board.value[index] = currentPlayer.value;

  if (!evaluateGameState()) {
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';

    // Lanzar subrutina de IA con un delay estético si se está contra el bot
    if (gameMode.value === 'vs_bot' && currentPlayer.value === 'O') {
      isBotThinking.value = true;
      setTimeout(makeBotMove, 600);
    }
  }
}

/**
 * Restablece todo el estado inicial para comenzar una nueva partida.
 */
function resetGame() {
  board.value = Array(9).fill(null);
  currentPlayer.value = 'X';
  winner.value = null;
  isDraw.value = false;
  isBotThinking.value = false;
}
</script>

<style scoped>
.tictactoe-app {
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

/* Selector de Modo Cyberpunk */
.mode-selector {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border: var(--glass-border);
  border-radius: 20px;
  padding: 4px;
  gap: 4px;
  margin-top: 4px;
}

.mode-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  padding: 6px 18px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  outline: none;
}

.mode-btn:hover {
  color: var(--text-primary);
}

.mode-btn.active {
  background: var(--neon-cyan);
  color: #000000;
  box-shadow: var(--glow-cyan);
}

/* Panel superior de estado */
.status-panel {
  text-align: center;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-panel h2 {
  font-size: 1.35rem;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.text-bot-thinking {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  font-size: 1.1rem;
  animation: pulse 1s infinite alternate;
}

.text-x {
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
}

.text-o {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
}

/* Contenedor del tablero */
.grid-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 280px;
  height: 280px;
  transition: opacity 0.3s ease;
}

.board-disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* Celdas del tablero */
.cell {
  background: rgba(255, 255, 255, 0.04);
  border: var(--glass-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.cell:hover:not(.cell-occupied) {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--text-primary);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

/* Estilos para el jugador X */
.neon-x {
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
}

/* Estilos para el jugador O */
.neon-o {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
}

/* Panel inferior para el botón de reinicio */
.action-panel {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-reset {
  background: var(--neon-cyan);
  border: 1px solid var(--neon-cyan);
  color: #000000;
  font-weight: bold;
  font-size: 0.95rem;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: var(--glow-cyan);
  transition: all 0.2s ease-in-out;
  outline: none;
}

.btn-reset:hover {
  background: transparent;
  color: var(--neon-cyan);
  box-shadow: 0 0 15px var(--neon-cyan);
  transform: translateY(-2px);
}

.btn-reset:active {
  transform: translateY(1px);
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

/* Transición fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="snake-app">
    <!-- Panel superior de información -->
    <div class="hud-panel">
      <div class="score-box">
        Puntuación: <span class="score-num">{{ score }}</span>
      </div>
      <div v-if="isGameOver" class="game-over-text">
        ¡FIN DEL JUEGO!
      </div>
      <div v-else class="direction-text">
        Dirección: <span class="dir-val">{{ direction }}</span>
      </div>
    </div>

    <!-- Tablero de renderizado visual 20x20 -->
    <div class="game-container">
      <div class="snake-grid">
        <div
          v-for="cellIndex in 400"
          :key="cellIndex"
          class="grid-cell"
          :class="getCellClass((cellIndex - 1) % 20, Math.floor((cellIndex - 1) / 20))"
        ></div>
      </div>
    </div>

    <!-- Botón de Reiniciar Partida (Visible al morir) -->
    <div class="control-panel">
      <Transition name="fade">
        <button
          v-if="isGameOver"
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
import { ref, onMounted, onUnmounted } from 'vue';

interface Coordinate {
  x: number;
  y: number;
}

// ---- Configuración y Estados Reactivos ----
const GRID_SIZE = 20;
const snake = ref<Coordinate[]>([{ x: 10, y: 10 }]);
const food = ref<Coordinate>({ x: 5, y: 5 });
const direction = ref<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP');
const score = ref<number>(0);
const isGameOver = ref<boolean>(false);

let gameInterval: number | null = null;

/**
 * Genera coordenadas aleatorias para la comida sin colisionar con la serpiente.
 */
function generateFood() {
  let newFood: Coordinate;
  let isColliding: boolean;

  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    isColliding = snake.value.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );
  } while (isColliding);

  food.value = newFood;
}

/**
 * Ejecuta el movimiento de la serpiente en cada iteración del Game Loop.
 */
function moveSnake() {
  if (isGameOver.value) return;

  const head = snake.value[0];
  let nextX = head.x;
  let nextY = head.y;

  // Determinar la siguiente posición según la dirección
  switch (direction.value) {
    case 'UP':
      nextY--;
      break;
    case 'DOWN':
      nextY++;
      break;
    case 'LEFT':
      nextX--;
      break;
    case 'RIGHT':
      nextX++;
      break;
  }

  // Lógica de colisión con los bordes del grid de 20x20
  if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
    triggerGameOver();
    return;
  }

  // Lógica de colisión con su propio cuerpo
  const selfCollision = snake.value.some(
    (segment) => segment.x === nextX && segment.y === nextY
  );
  if (selfCollision) {
    triggerGameOver();
    return;
  }

  const newHead: Coordinate = { x: nextX, y: nextY };
  
  // Agregar nueva cabeza al frente
  snake.value.unshift(newHead);

  // Verificar si come comida
  if (nextX === food.value.x && nextY === food.value.y) {
    score.value += 10;
    // Añade el duplicado para forzar crecimiento (push requerido por instrucciones)
    snake.value.push({ ...snake.value[snake.value.length - 1] });
    generateFood();
  } else {
    // Si no come, remueve el último segmento
    snake.value.pop();
  }
}

/**
 * Finaliza el juego y limpia el loop de tiempo.
 */
function triggerGameOver() {
  isGameOver.value = true;
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
}

/**
 * Captura e interpreta el teclado global previniendo comportamientos no deseados.
 */
function handleKeydown(e: KeyboardEvent) {
  // Bloquear scroll de la página con teclas direccionales
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  if (isGameOver.value) return;

  // Filtrado de contra-direcciones directas para evitar colapso
  switch (e.key) {
    case 'ArrowUp':
      if (direction.value !== 'DOWN') direction.value = 'UP';
      break;
    case 'ArrowDown':
      if (direction.value !== 'UP') direction.value = 'DOWN';
      break;
    case 'ArrowLeft':
      if (direction.value !== 'RIGHT') direction.value = 'LEFT';
      break;
    case 'ArrowRight':
      if (direction.value !== 'LEFT') direction.value = 'RIGHT';
      break;
  }
}

/**
 * Retorna las clases de visualización para celdas del tablero.
 */
function getCellClass(x: number, y: number): string {
  const isSnake = snake.value.some((segment) => segment.x === x && segment.y === y);
  if (isSnake) return 'cell-snake';

  const isFood = food.value.x === x && food.value.y === y;
  if (isFood) return 'cell-food';

  return '';
}

/**
 * Restablece el juego completo.
 */
function resetGame() {
  snake.value = [{ x: 10, y: 10 }];
  direction.value = 'UP';
  score.value = 0;
  isGameOver.value = false;
  generateFood();

  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = window.setInterval(moveSnake, 150);
}

// ---- Ciclo de Vida ----
onMounted(() => {
  generateFood();
  window.addEventListener('keydown', handleKeydown);
  gameInterval = window.setInterval(moveSnake, 150);
});

onUnmounted(() => {
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.snake-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-family-base);
  padding: 24px;
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
  font-weight: 600;
  font-size: 1.1rem;
}

.score-box {
  background: rgba(255, 255, 255, 0.05);
  border: var(--glass-border);
  padding: 6px 16px;
  border-radius: 8px;
}

.score-num {
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
}

.game-over-text {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  font-weight: 800;
  letter-spacing: 1px;
}

.direction-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.dir-val {
  color: var(--neon-cyan);
  font-weight: bold;
}

/* Contenedor central del juego */
.game-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.snake-grid {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(20, 1fr);
  gap: 1px;
  width: 320px;
  height: 320px;
  background: rgba(0, 0, 0, 0.6);
  border: var(--glass-border);
  border-radius: 12px;
  padding: 4px;
  box-sizing: border-box;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.8);
}

/* Celdas básicas */
.grid-cell {
  background: rgba(255, 255, 255, 0.01);
  border-radius: 1px;
}

/* Celda de la Serpiente (Cyber Cyan) */
.cell-snake {
  background: var(--neon-cyan) !important;
  box-shadow: var(--glow-cyan);
  border-radius: 2px;
}

/* Celda de la Comida (Cyber Magenta) */
.cell-food {
  background: var(--neon-magenta) !important;
  box-shadow: var(--glow-magenta);
  border-radius: 50%;
  animation: pulse 0.8s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(0.85);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.15);
    opacity: 1;
  }
}

/* Panel de controles inferior */
.control-panel {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-reset {
  background: var(--neon-magenta);
  border: 1px solid var(--neon-magenta);
  color: #ffffff;
  font-weight: bold;
  font-size: 1rem;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: var(--glow-magenta);
  transition: all 0.2s ease-in-out;
  outline: none;
}

.btn-reset:hover {
  background: transparent;
  color: var(--neon-magenta);
  box-shadow: 0 0 15px var(--neon-magenta);
  transform: translateY(-2px);
}

.btn-reset:active {
  transform: translateY(1px);
}

/* Animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

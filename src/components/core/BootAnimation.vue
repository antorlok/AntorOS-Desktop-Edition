<template>
  <div class="boot-animation-overlay">
    <div class="boot-content">
      <!-- Logo Central de ANTOR OS con Animación de Glitch Neón -->
      <h1 class="boot-logo" data-text="ANTOR OS">ANTOR OS</h1>
      
      <!-- Subtexto y Barra de Carga Cyberpunk -->
      <div class="boot-loader-container">
        <div class="boot-progress-bar">
          <div class="boot-progress-fill"></div>
        </div>
        <span class="boot-status-text">INICIALIZANDO KERNEL...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente de presentación pura (animado por CSS a pantalla completa)
</script>

<style scoped>
.boot-animation-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #000000; /* Negro profundo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999; /* Máxima prioridad visual, por encima de todo */
  overflow: hidden;
  user-select: none;
}

.boot-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
}

/* Animación Neón de ANTOR OS */
.boot-logo {
  font-family: 'Courier New', Courier, monospace;
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 6px;
  position: relative;
  text-shadow: 
    0 0 10px rgba(0, 243, 255, 0.8),
    0 0 20px rgba(0, 243, 255, 0.4),
    0 0 30px rgba(0, 243, 255, 0.2);
  animation: bootPulse 2s infinite ease-in-out, logoGlitch 4s infinite alternate;
}

/* Efecto de Glitch Cyberpunk en el texto */
@keyframes logoGlitch {
  0% {
    transform: skew(0deg);
  }
  20% {
    transform: skew(-2deg);
    text-shadow: 
      2px -2px 0 rgba(255, 0, 255, 0.8),
      -2px 2px 0 rgba(0, 243, 255, 0.8);
  }
  22% {
    transform: skew(0deg);
    text-shadow: 
      0 0 10px rgba(0, 243, 255, 0.8),
      0 0 20px rgba(0, 243, 255, 0.4);
  }
  80% {
    transform: skew(0deg);
  }
  82% {
    transform: skew(3deg);
    text-shadow: 
      -3px -1px 0 rgba(255, 0, 255, 0.8),
      3px 1px 0 rgba(0, 243, 255, 0.8);
  }
  85% {
    transform: skew(0deg);
  }
}

@keyframes bootPulse {
  0%, 100% {
    opacity: 0.9;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.2) drop-shadow(0 0 15px rgba(0, 243, 255, 0.8));
  }
}

/* Barra de Carga Cyberpunk */
.boot-loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 240px;
}

.boot-progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 243, 255, 0.1);
}

.boot-progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(to right, var(--neon-cyan, #00f3ff), var(--neon-magenta, #ff00ff));
  box-shadow: 0 0 8px var(--neon-cyan, #00f3ff);
  animation: bootProgress 5s linear forwards;
}

@keyframes bootProgress {
  0% {
    width: 0%;
  }
  15% {
    width: 25%;
  }
  40% {
    width: 45%;
  }
  55% {
    width: 50%;
  }
  75% {
    width: 85%;
  }
  100% {
    width: 100%;
  }
}

.boot-status-text {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--neon-cyan, #00f3ff);
  letter-spacing: 2px;
  text-shadow: 0 0 6px rgba(0, 243, 255, 0.3);
  animation: textBlink 1s infinite alternate;
}

@keyframes textBlink {
  from { opacity: 0.4; }
  to { opacity: 1; }
}
</style>

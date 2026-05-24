<template>
  <div class="settings-section">
    <!-- PANEL DE INFORMACIÓN GENERAL -->
    <SettingCard title="Acerca del Sistema" :icon="InfoIcon">
      <div class="about-container">
        <!-- LOGO GLITCH ESTILO REINICIO -->
        <div class="logo-boot-preview">
          <h1 class="boot-logo" data-text="ANTOR OS">ANTOR OS</h1>
        </div>

        <div class="distro-details">
          <h3 class="distro-name">Antor OS Desktop Edition</h3>
          <p class="distro-author">Creado por <strong>antorlok</strong></p>
          <span class="distro-version">Versión 3.0.0-Beta (Cyber-Neon Edition)</span>
        </div>
      </div>
    </SettingCard>

    <!-- PANEL DE ESPECIFICACIONES TÉCNICAS -->
    <SettingCard title="Especificaciones del Hardware & Kernel" :icon="CpuIcon">
      <div class="setting-rows-list">
        <div class="tech-spec-row">
          <span class="spec-label">Núcleo / Kernel</span>
          <span class="spec-value code-font">Go Daemon v1.21.5 (Gorilla WebSockets)</span>
        </div>
        <div class="row-divider"></div>

        <div class="tech-spec-row">
          <span class="spec-label">Entorno Gráfico</span>
          <span class="spec-value code-font">Vue 3 (Composition API & Pinia)</span>
        </div>
        <div class="row-divider"></div>

        <div class="tech-spec-row">
          <span class="spec-label">Base de Datos local</span>
          <span class="spec-value code-font">IndexedDB (Dexie.js) & SQLite3</span>
        </div>
        <div class="row-divider"></div>

        <div class="tech-spec-row">
          <span class="spec-label">Contenedor de Escritorio</span>
          <span class="spec-value code-font">Electron v28.1.0</span>
        </div>
        <div class="row-divider"></div>

        <div class="tech-spec-row">
          <span class="spec-label">Estado de Carga CPU</span>
          <span class="spec-value">{{ osStore.stats.cpu_usage }}% ({{ osStore.stats.cpu_temp }}°C)</span>
        </div>
      </div>
    </SettingCard>
  </div>
</template>

<script setup lang="ts">
import { useOSStore } from '@/stores/osStore';
import SettingCard from '@/components/ui/SettingCard.vue';
import { Info as InfoIcon, Cpu as CpuIcon } from 'lucide-vue-next';

const osStore = useOSStore();
</script>

<style scoped>
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.35s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 20px 0;
  text-align: center;
}

/* CONTENEDOR LOGO GLITCH ESTILO REINICIO */
.logo-boot-preview {
  background: #000000;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0, 243, 255, 0.25);
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
  overflow: hidden;
}

/* Estilo copiado exactamente de BootAnimation.vue */
.boot-logo {
  font-family: 'Courier New', Courier, monospace;
  font-size: 2.4rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 5px;
  position: relative;
  text-shadow: 
    0 0 10px rgba(0, 243, 255, 0.8),
    0 0 20px rgba(0, 243, 255, 0.4),
    0 0 30px rgba(0, 243, 255, 0.2);
  animation: bootPulse 2s infinite ease-in-out, logoGlitch 4s infinite alternate;
}

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

.distro-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.distro-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
}

.distro-author {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.distro-author strong {
  color: var(--text-primary);
}

.distro-version {
  font-size: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

/* ESPECIFICACIONES TÉCNICAS */
.setting-rows-list {
  display: flex;
  flex-direction: column;
}

.tech-spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 0.85rem;
}

.spec-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.spec-value {
  color: var(--text-primary);
}

.code-font {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

:global(.light-theme) .code-font {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.05);
}

.row-divider {
  height: 1px;
  background: var(--glass-border);
}
</style>

<template>
  <div class="settings-section">
    <!-- TARJETA DE CONTROL OTA: ACTUALIZACIONES DEL SISTEMA -->
    <SettingCard title="Actualizaciones del Sistema" :icon="RefreshCwIcon">
      <div class="setting-rows-list">
        
        <!-- Fila 1: Versión Actual e Información de Estado -->
        <div class="setting-row version-info-row">
          <div class="row-info">
            <span class="row-title">Versión del Sistema</span>
            <span class="row-sub">
              Versión Instalada: <strong class="version-badge">{{ updateStore.currentVersion }}</strong>
            </span>
            <span v-if="hasUpdate" class="update-alert-text">
              Nueva versión disponible: <strong class="version-badge-remote">{{ updateStore.remoteVersion }}</strong>
            </span>
          </div>
          <div class="version-status">
            <span v-if="updateStore.isChecking" class="status-checking">Buscando...</span>
            <span v-else-if="hasUpdate" class="status-update-available">Actualización disponible</span>
            <span v-else class="status-up-to-date">Tu sistema está al día</span>
          </div>
        </div>

        <div class="row-divider"></div>

        <!-- Fila 2: Acción Principal / Barra de Progreso -->
        <div class="setting-row action-row">
          <div class="row-info">
            <span class="row-title">Canal de Distribución</span>
            <span class="row-sub">Canal Oficial Estable de AntorOS.</span>
          </div>

          <div class="action-container">
            <!-- Botón para Buscar Actualizaciones -->
            <button
              v-if="!updateStore.remoteVersion && !updateStore.isChecking"
              class="btn-neon-cyan"
              @click="updateStore.checkForUpdates"
            >
              Buscar actualizaciones
            </button>
            <button
              v-else-if="updateStore.isChecking"
              class="btn-neon-cyan disabled"
              disabled
            >
              Buscando...
            </button>

            <!-- Botón para Aplicar/Instalar Parche -->
            <button
              v-else-if="hasUpdate && !updateStore.isDownloading"
              class="btn-neon-magenta"
              @click="updateStore.startUpdate"
            >
              Instalar Ahora
            </button>

            <!-- Barra de Progreso de Descarga OTA -->
            <div v-else-if="updateStore.isDownloading" class="progress-container">
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill" :style="{ width: updateStore.downloadProgress + '%' }"></div>
              </div>
              <span class="progress-percent">{{ updateStore.downloadProgress }}%</span>
            </div>
          </div>
        </div>

        <!-- Sección del Registro de Cambios (Changelog) -->
        <Transition name="expand">
          <div v-if="hasUpdate" class="changelog-section">
            <h4 class="changelog-title">Registro de Cambios (Changelog):</h4>
            <ul class="changelog-list">
              <li v-for="(change, idx) in updateStore.changelog" :key="idx" class="changelog-item">
                {{ change }}
              </li>
            </ul>
          </div>
        </Transition>

      </div>
    </SettingCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUpdateStore } from '@/stores/updateStore';
import SettingCard from '@/components/ui/SettingCard.vue';
import { RefreshCw as RefreshCwIcon } from 'lucide-vue-next';

const updateStore = useUpdateStore();

const hasUpdate = computed(() => {
  return (
    updateStore.remoteVersion !== null &&
    updateStore.remoteVersion !== updateStore.currentVersion
  );
});
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

.setting-rows-list {
  display: flex;
  flex-direction: column;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.row-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 16px;
}

.row-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
}

.row-sub {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.row-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 6px 0;
}

/* Badges e info de versión */
.version-badge {
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
  font-family: monospace;
  font-weight: 700;
}

.version-badge-remote {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  font-family: monospace;
  font-weight: 700;
}

.update-alert-text {
  font-size: 0.75rem;
  color: var(--neon-magenta);
  margin-top: 2px;
}

/* Estados */
.status-checking {
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-style: italic;
}

.status-update-available {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  font-weight: bold;
  font-size: 0.8rem;
}

.status-up-to-date {
  color: var(--neon-green);
  text-shadow: var(--glow-green);
  font-weight: bold;
  font-size: 0.8rem;
}

/* Botones Neón */
.btn-neon-cyan {
  background: var(--neon-cyan);
  border: 1px solid var(--neon-cyan);
  color: #000000;
  font-weight: bold;
  font-size: 0.82rem;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: var(--glow-cyan);
  transition: all 0.2s ease-in-out;
  outline: none;
}

.btn-neon-cyan:hover:not(.disabled) {
  background: transparent;
  color: var(--neon-cyan);
  box-shadow: 0 0 12px var(--neon-cyan);
}

.btn-neon-cyan.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-neon-magenta {
  background: var(--neon-magenta);
  border: 1px solid var(--neon-magenta);
  color: #ffffff;
  font-weight: bold;
  font-size: 0.82rem;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: var(--glow-magenta);
  transition: all 0.2s ease-in-out;
  outline: none;
}

.btn-neon-magenta:hover {
  background: transparent;
  color: var(--neon-magenta);
  box-shadow: 0 0 12px var(--neon-magenta);
}

/* Contenedor de Progreso */
.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 180px;
}

.progress-bar-wrapper {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  border: var(--glass-border);
}

.progress-bar-fill {
  height: 100%;
  background: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
  transition: width 0.3s ease;
}

.progress-percent {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
  font-weight: bold;
  width: 32px;
  text-align: right;
}

/* Changelog */
.changelog-section {
  background: rgba(255, 255, 255, 0.02);
  border: var(--glass-border);
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 12px;
}

.changelog-title {
  font-size: 0.82rem;
  font-weight: bold;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.changelog-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.changelog-item {
  font-size: 0.76rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Transición de expansión para el Changelog */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
</style>

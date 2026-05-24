<template>
  <div class="settings-section">
    <!-- PANEL DE PERSONALIZACIÓN DEL SISTEMA -->
    <SettingCard title="Personalización" :icon="PaletteIcon">
      <div class="setting-rows-list">
        <!-- Fila: Modo Claro -->
        <div class="setting-row">
          <div class="row-info">
            <span class="row-title">Modo Claro</span>
            <span class="row-sub">Utilizar un esquema de colores claros para ventanas y paneles (Estilo GNOME Light).</span>
          </div>
          <ToggleSwitch v-model="isLightTheme" />
        </div>

        <div class="row-divider"></div>

        <!-- Fila: Mostrar Dock -->
        <div class="setting-row">
          <div class="row-info">
            <span class="row-title">Mostrar Dock de Aplicaciones</span>
            <span class="row-sub">Mantener la barra inferior de accesos rápidos visible en el escritorio central.</span>
          </div>
          <ToggleSwitch v-model="configStore.dockEnabled" />
        </div>
      </div>
    </SettingCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConfigStore } from '@/stores/configStore';
import SettingCard from '@/components/ui/SettingCard.vue';
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue';
import { Palette as PaletteIcon } from 'lucide-vue-next';

const configStore = useConfigStore();

// Getter y setter bidireccionales computados sobre el store de Pinia para el tema
const isLightTheme = computed({
  get() {
    return configStore.theme === 'light';
  },
  set() {
    configStore.toggleTheme();
  }
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
</style>

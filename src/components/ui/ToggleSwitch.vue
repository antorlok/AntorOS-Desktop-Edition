<template>
  <button
    type="button"
    class="toggle-switch"
    :class="{ 'switch-active': modelValue }"
    @click="toggle"
    role="switch"
    :aria-checked="modelValue"
  >
    <span class="switch-handle"></span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function toggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>

<style scoped>
.toggle-switch {
  width: 42px;
  height: 22px;
  background-color: var(--bg-primary); /* Fondo inactivo adaptado */
  border: var(--glass-border);
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.toggle-switch:focus-visible {
  box-shadow: var(--glow-cyan);
  border-color: var(--neon-cyan);
}

.switch-active {
  background-color: var(--neon-cyan) !important; /* Acento dinámico adaptable */
  border-color: var(--neon-cyan) !important;
  box-shadow: var(--glow-cyan);
}

.switch-handle {
  width: 14px;
  height: 14px;
  background-color: var(--text-primary); /* Círculo hereda color de texto primario */
  border-radius: 50%;
  position: absolute;
  left: 3px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-active .switch-handle {
  transform: translateX(20px); /* 3px left + 20px shift = 23px. Con ancho 14px, 23px + 14px = 37px. Margen derecho = 42px - 37px = 5px. Perfectamente simétrico y seguro. */
  background-color: var(--bg-primary); /* Círculo cambia para contraste óptimo */
}
</style>

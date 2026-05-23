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
  width: 44px;
  height: 24px;
  background-color: #313244; /* Fondo gris oscuro Catppuccin */
  border-radius: 9999px;
  border: none;
  position: relative;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.toggle-switch:focus-visible {
  box-shadow: 0 0 0 2px rgba(229, 200, 144, 0.4);
}

.switch-active {
  background-color: #e5c890 !important; /* Acento amarillo/dorado */
}

.switch-handle {
  width: 18px;
  height: 18px;
  background-color: #f5e0dc; /* Color del círculo */
  border-radius: 50%;
  position: absolute;
  left: 3px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

.switch-active .switch-handle {
  transform: translateX(20px);
  background-color: #11111b; /* Círculo cambia a oscuro para contraste */
}
</style>

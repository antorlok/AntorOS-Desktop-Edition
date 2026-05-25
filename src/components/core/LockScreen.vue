<template>
  <div class="lock-screen">
    <!-- Cuadrícula cyberpunk de fondo -->
    <div class="grid-overlay" aria-hidden="true"></div>

    <!-- Panel de autenticación centrado -->
    <div class="auth-panel">
      <!-- Avatar de usuario -->
      <div class="avatar-wrapper">
        <img v-if="userStore.avatarUrl" :src="userStore.avatarUrl" class="avatar-img" alt="Avatar de Usuario" />
        <UserIcon v-else class="avatar-icon" />
        <div class="avatar-glow" aria-hidden="true"></div>
      </div>

      <h2 class="username">{{ userStore.username }}</h2>
      <p class="subtitle">Ingresa tu contraseña para continuar</p>

      <!-- Campo de contraseña con borde neón inferior -->
      <div class="input-wrapper" :class="{ 'input-error': hasError }">
        <LockIcon class="input-icon" />
        <input
          id="lock-password-input"
          ref="inputRef"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          class="password-input"
          placeholder="Contraseña"
          autocomplete="current-password"
          @keydown.enter="handleUnlock"
        />
        <button
          type="button"
          class="password-toggle-btn"
          @click="showPassword = !showPassword"
          :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        >
          <EyeIcon v-if="!showPassword" class="toggle-icon" />
          <EyeOffIcon v-else class="toggle-icon" />
        </button>
      </div>

      <!-- Mensaje de error -->
      <Transition name="fade">
        <p v-if="hasError" class="error-msg">Contraseña incorrecta. Intenta de nuevo.</p>
      </Transition>

      <!-- Botón de desbloqueo -->
      <button id="lock-unlock-btn" class="unlock-btn" @click="handleUnlock">
        <UnlockIcon class="btn-icon" />
        Desbloquear
      </button>
    </div>

    <!-- Hora del sistema (decorativa) -->
    <div class="system-clock">
      <span class="clock-time">{{ currentTime }}</span>
      <span class="clock-date">{{ currentDate }}</span>
    </div>

    <!-- Controles de energía en el menú de arranque -->
    <div class="power-controls">
      <button type="button" class="power-btn" @click="handleRestart" title="Reiniciar Sistema">
        <RotateCwIcon class="power-icon icon-green" />
      </button>
      <button type="button" class="power-btn btn-danger" @click="handleShutdown" title="Apagar Equipo">
        <PowerIcon class="power-icon icon-magenta" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  User as UserIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  RotateCw as RotateCwIcon,
  Power as PowerIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon
} from 'lucide-vue-next';
import { useOSStore } from '@/stores/osStore';
import { useUserStore } from '@/stores/userStore';

const osStore = useOSStore();
const userStore = useUserStore();
const inputRef = ref<HTMLInputElement | null>(null);
const password = ref('');
const hasError = ref(false);
const showPassword = ref(false);

function handleShutdown() {
  if (window.osAPI && typeof window.osAPI.shutdown === 'function') {
    window.osAPI.shutdown();
  } else {
    console.warn('[Power] Apagado invocado fuera del contenedor de Electron.');
    alert('Apagado físico simulado. Sesión finalizada.');
  }
}

function handleRestart() {
  osStore.isBooting = true;
  osStore.windows = [];
  try {
    const audioCtx = (window as any).audioContext;
    if (audioCtx) audioCtx.close();
  } catch (e) {}

  setTimeout(() => {
    osStore.isBooting = false;
    osStore.isAuthenticated = false;
    password.value = '';
    hasError.value = false;
  }, 5000);
}

// ---- Reloj del sistema ----
const currentTime = ref('');
const currentDate = ref('');
let clockInterval: ReturnType<typeof setInterval>;

function updateClock() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  currentDate.value = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

onMounted(() => {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
  // Foco automático al montar para accesibilidad
  inputRef.value?.focus();
});

onUnmounted(() => clearInterval(clockInterval));

// ---- Lógica de autenticación reactiva ----
function handleUnlock() {
  if (password.value === userStore.password) {
    osStore.unlock();
    return;
  }

  // Activar animación de error y limpiar el input
  hasError.value = true;
  password.value = '';
  inputRef.value?.focus();

  // Auto-limpiar el estado de error tras la animación
  setTimeout(() => {
    hasError.value = false;
  }, 600);
}
</script>

<style scoped>
.lock-screen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 999999;
}

/* Cuadrícula cyberpunk en perspectiva (decorativa) */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
  pointer-events: none;
}

/* Gradiente radial de ambiente */
.lock-screen::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.06) 0%, transparent 60%);
  pointer-events: none;
}

/* Panel central */
.auth-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 48px 56px;
  background: rgba(17, 17, 17, 0.5);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 243, 255, 0.15);
  border-radius: 24px;
  box-shadow:
    0 0 60px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(0, 243, 255, 0.08),
    inset 0 0 30px rgba(0, 243, 255, 0.03);
  min-width: 380px;
}

/* Avatar */
.avatar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 2px solid rgba(0, 243, 255, 0.4);
  background: rgba(0, 243, 255, 0.05);
  margin-bottom: 4px;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-icon {
  width: 44px;
  height: 44px;
  color: var(--neon-cyan);
  filter: drop-shadow(0 0 8px var(--neon-cyan));
}

/* Halo animado alrededor del avatar */
.avatar-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(0, 243, 255, 0.2);
  animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.08); }
}

.username {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin: 0;
}

.subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  margin: -8px 0 0;
}

/* Input de contraseña */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 2px solid var(--neon-cyan);
  border-radius: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: rgba(255, 255, 255, 0.2);
  border-bottom-color: var(--neon-magenta);
  box-shadow: 0 4px 12px rgba(255, 0, 255, 0.15);
}

/* Estado de error con animación shake */
.input-error {
  border-bottom-color: #ff4444 !important;
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.25) !important;
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes shake {
  10%, 90%  { transform: translateX(-2px); }
  20%, 80%  { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-6px); }
  40%, 60%  { transform: translateX(6px); }
}

.input-icon {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
}

.password-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 0.95rem;
  font-family: inherit;
  letter-spacing: 3px;
}

.password-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 1px;
}

/* Mensaje de error */
.error-msg {
  font-size: 0.82rem;
  color: #ff4444;
  margin: -8px 0 0;
  text-shadow: 0 0 6px rgba(255, 68, 68, 0.4);
}

/* Botón de desbloqueo */
.unlock-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(135deg, rgba(0, 243, 255, 0.12), rgba(255, 0, 255, 0.12));
  border: 1px solid rgba(0, 243, 255, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 8px;
  width: 100%;
  justify-content: center;
}

.unlock-btn:hover {
  background: linear-gradient(135deg, rgba(0, 243, 255, 0.22), rgba(255, 0, 255, 0.22));
  border-color: var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.2), 0 0 40px rgba(255, 0, 255, 0.1);
  transform: translateY(-1px);
}

.unlock-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Reloj del sistema (esquina superior derecha) */
.system-clock {
  position: absolute;
  top: 36px;
  right: 48px;
  text-align: right;
  pointer-events: none;
}

.clock-time {
  display: block;
  font-size: 3rem;
  font-weight: 200;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 4px;
  line-height: 1;
  text-shadow: 0 0 20px rgba(0, 243, 255, 0.25);
}

.clock-date {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: capitalize;
  letter-spacing: 1px;
  margin-top: 6px;
}

/* Transición fade para el mensaje de error */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Controles de energía en el arranque (inferior derecha) */
.power-controls {
  position: absolute;
  bottom: 36px;
  right: 48px;
  display: flex;
  gap: 16px;
  z-index: 10;
}

.power-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.power-btn:hover {
  transform: scale(1.08) translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

.power-icon {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
}

.power-btn:hover .icon-green {
  color: var(--neon-green);
  filter: drop-shadow(var(--glow-green));
}

.power-btn:hover:not(.btn-danger) {
  border-color: var(--neon-green);
  box-shadow: var(--glow-green);
}

.btn-danger:hover {
  border-color: var(--neon-magenta) !important;
  box-shadow: var(--glow-magenta) !important;
  background: rgba(244, 63, 94, 0.08) !important;
}

.btn-danger:hover .icon-magenta {
  color: var(--neon-magenta);
  filter: drop-shadow(var(--glow-magenta));
}

/* Botón de visibilidad de contraseña */
.password-toggle-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  transition: color 0.2s ease;
}

.password-toggle-btn:hover {
  color: var(--neon-cyan);
}

.toggle-icon {
  width: 18px;
  height: 18px;
}
</style>

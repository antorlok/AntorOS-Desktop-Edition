<template>
  <div class="user-settings-section">
    <!-- TARJETA 1: INFORMACIÓN PÚBLICA -->
    <SettingCard title="Información Pública" :icon="UserIcon">
      <div class="profile-layout">
        <!-- Panel Izquierdo: Avatar y Modificación -->
        <div class="avatar-column">
          <div class="profile-avatar-wrapper">
            <img :src="draftAvatar" alt="Avatar de Usuario" class="profile-avatar-img" />
            <div class="avatar-shadow-overlay"></div>
          </div>
          <button type="button" class="action-btn" @click="changeAvatarPrompt">
            <CameraIcon class="btn-icon" />
            Cambiar Foto
          </button>
        </div>

        <!-- Panel Derecho: Campos de Texto -->
        <div class="fields-column">
          <div class="input-group">
            <label for="username-input" class="input-label">Nombre de Usuario</label>
            <input
              id="username-input"
              v-model="draftName"
              type="text"
              class="styled-input"
              placeholder="Ej. hacker_gamer"
              spellcheck="false"
            />
          </div>

          <div class="input-group">
            <label for="email-input" class="input-label">Correo Electrónico</label>
            <input
              id="email-input"
              v-model="draftEmail"
              type="email"
              class="styled-input"
              placeholder="Ej. usuario@correo.com"
              spellcheck="false"
            />
          </div>

          <div class="action-row">
            <button type="button" class="save-btn" @click="saveProfile">
              <CheckIcon class="btn-icon" />
              Guardar Cambios
            </button>
            <Transition name="fade">
              <span v-if="profileSuccess" class="success-text">¡Perfil actualizado correctamente!</span>
            </Transition>
          </div>
        </div>
      </div>
    </SettingCard>

    <!-- TARJETA 2: SEGURIDAD Y AUTENTICACIÓN -->
    <SettingCard title="Cambiar Contraseña" :icon="ShieldAlertIcon">
      <div class="security-layout">
        <div class="input-group">
          <label for="current-password-input" class="input-label">Contraseña Actual</label>
          <input
            id="current-password-input"
            v-model="currentPassword"
            type="password"
            class="styled-input"
            placeholder="••••••••"
            autocomplete="current-password"
          />
        </div>

        <div class="input-group">
          <label for="new-password-input" class="input-label">Nueva Contraseña</label>
          <input
            id="new-password-input"
            v-model="newPassword"
            type="password"
            class="styled-input"
            placeholder="••••••••"
            autocomplete="new-password"
          />
        </div>

        <div class="input-group">
          <label for="confirm-password-input" class="input-label">Confirmar Nueva Contraseña</label>
          <input
            id="confirm-password-input"
            v-model="confirmPassword"
            type="password"
            class="styled-input"
            placeholder="••••••••"
            autocomplete="new-password"
          />
        </div>

        <div class="action-row-col">
          <button type="button" class="save-btn security-btn" @click="changePassword">
            <KeyIcon class="btn-icon" />
            Actualizar Contraseña
          </button>
          
          <Transition name="fade">
            <p v-if="securityError" class="error-text">{{ securityError }}</p>
            <p v-else-if="securitySuccess" class="success-text">{{ securitySuccess }}</p>
          </Transition>
        </div>
      </div>
    </SettingCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import SettingCard from '@/components/ui/SettingCard.vue';
import {
  User as UserIcon,
  Camera as CameraIcon,
  Check as CheckIcon,
  ShieldAlert as ShieldAlertIcon,
  Key as KeyIcon
} from 'lucide-vue-next';

const userStore = useUserStore();

// ---- Estados Locales para Información Pública ----
const draftName = ref(userStore.username);
const draftEmail = ref(userStore.email);
const draftAvatar = ref(userStore.avatarUrl);
const profileSuccess = ref(false);

// ---- Estados Locales para Cambio de Contraseña ----
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const securityError = ref('');
const securitySuccess = ref('');

// Prompt interactivo para cambiar el avatar de forma rápida
function changeAvatarPrompt() {
  const newUrl = prompt('Ingresa la URL completa para tu nueva foto de perfil:', draftAvatar.value);
  if (newUrl !== null) {
    const trimmed = newUrl.trim();
    if (trimmed) {
      draftAvatar.value = trimmed;
    }
  }
}

// Guardar cambios del perfil
function saveProfile() {
  if (!draftName.value.trim()) {
    alert('El nombre de usuario no puede estar vacío.');
    return;
  }
  userStore.updateProfile(draftName.value, draftEmail.value, draftAvatar.value);
  profileSuccess.value = true;
  setTimeout(() => {
    profileSuccess.value = false;
  }, 3000);
}

// Cambiar contraseña de forma segura con validaciones
function changePassword() {
  securityError.value = '';
  securitySuccess.value = '';

  const current = currentPassword.value;
  const next = newPassword.value;
  const confirm = confirmPassword.value;

  // Validaciones locales
  if (!current || !next || !confirm) {
    securityError.value = 'Por favor, completa todos los campos de contraseña.';
    return;
  }

  if (next !== confirm) {
    securityError.value = 'La nueva contraseña y su confirmación no coinciden.';
    return;
  }

  if (next.length < 4) {
    securityError.value = 'La nueva contraseña debe tener al menos 4 caracteres.';
    return;
  }

  // Llamar al store para validar contraseña actual y aplicar cambios
  const result = userStore.updatePassword(current, next);
  if (result) {
    securitySuccess.value = '¡Contraseña actualizada con éxito!';
    // Limpiar campos
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } else {
    securityError.value = 'La contraseña actual es incorrecta.';
  }
}
</script>

<style scoped>
.user-settings-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.35s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Layout de Perfil */
.profile-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

@media (max-width: 600px) {
  .profile-layout {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
}

.avatar-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.profile-avatar-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.profile-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-shadow-overlay {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
  pointer-events: none;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-primary);
  border: var(--glass-border);
  border-radius: 8px;
  padding: 6px 12px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--neon-cyan);
  color: #11111b;
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.btn-icon {
  width: 14px;
  height: 14px;
}

/* Campos de entrada derecho */
.fields-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.input-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.styled-input {
  width: 100%;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.styled-input:focus {
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

/* Fila de acción */
.action-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-primary);
  border: var(--glass-border);
  border-radius: 8px;
  padding: 10px 20px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover {
  background: var(--neon-cyan);
  color: #11111b;
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.success-text {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--neon-green);
  text-shadow: var(--glow-green);
}

.error-text {
  font-size: 0.8rem;
  font-weight: bold;
  color: #ff4444;
  text-shadow: 0 0 8px rgba(255, 68, 68, 0.2);
}

/* Layout de seguridad */
.security-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-row-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  margin-top: 8px;
}

.security-btn:hover {
  background: var(--neon-magenta);
  border-color: var(--neon-magenta);
  box-shadow: var(--glow-magenta);
}

/* Transiciones de alerta */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

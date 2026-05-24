import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useUserStore = defineStore('user', () => {
  // ---- Estructura de Datos del Perfil de Usuario ----
  interface UserProfile {
    username: string;
    email: string;
    avatarUrl: string;
    password?: string;
  }

  // ---- Valores por Defecto ----
  const DEFAULT_PROFILE: UserProfile = {
    username: 'antorlok',
    email: 'antorlok@antoros.org',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    password: '1234'
  };

  // ---- Recuperar Estado del localStorage o usar valores por defecto ----
  const savedData = localStorage.getItem('antorui-user');
  let initialProfile = DEFAULT_PROFILE;

  if (savedData) {
    try {
      initialProfile = { ...DEFAULT_PROFILE, ...JSON.parse(savedData) };
    } catch (e) {
      console.error('Error al parsear el perfil de usuario guardado:', e);
    }
  }

  // ---- Estados Reactivos ----
  const username = ref(initialProfile.username);
  const email = ref(initialProfile.email);
  const avatarUrl = ref(initialProfile.avatarUrl);
  const password = ref(initialProfile.password || '1234');

  // ---- Persistencia Automática Reactiva ----
  watch(
    [username, email, avatarUrl, password],
    () => {
      const dataToSave = {
        username: username.value,
        email: email.value,
        avatarUrl: avatarUrl.value,
        password: password.value
      };
      localStorage.setItem('antorui-user', JSON.stringify(dataToSave));
    },
    { deep: true }
  );

  // ---- Acciones ----
  /**
   * Actualiza la información pública del perfil.
   */
  function updateProfile(newName: string, newEmail: string, newAvatar: string) {
    username.value = newName.trim();
    email.value = newEmail.trim();
    avatarUrl.value = newAvatar.trim();
  }

  /**
   * Actualiza de forma segura la contraseña tras verificar la contraseña actual.
   * Retorna true en caso de éxito, false de lo contrario.
   */
  function updatePassword(currentPass: string, newPass: string): boolean {
    if (currentPass === password.value) {
      password.value = newPass;
      return true;
    }
    return false;
  }

  return {
    username,
    email,
    avatarUrl,
    password,
    updateProfile,
    updatePassword
  };
});

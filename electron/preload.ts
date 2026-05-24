import { contextBridge, ipcRenderer } from 'electron';

// API segura expuesta al espacio de usuario (Vue 3) bajo window.osAPI
const osAPI = {
  minimizeWindow: (): void => {
    ipcRenderer.send('window:minimize');
  },
  maximizeWindow: (): void => {
    ipcRenderer.send('window:maximize');
  },
  closeWindow: (): void => {
    ipcRenderer.send('window:close');
  },
  shutdown: (): void => {
    ipcRenderer.send('system:shutdown');
  },
  setVolume: (level: number): void => {
    ipcRenderer.send('audio:set-volume', level);
  },
  toggleMute: (isMuted: boolean): void => {
    ipcRenderer.send('audio:toggle-mute', isMuted);
  },
};

contextBridge.exposeInMainWorld('osAPI', osAPI);

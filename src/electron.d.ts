/// <reference types="electron" />

interface Window {
  osAPI: {
    minimizeWindow: () => void;
    maximizeWindow: () => void;
    closeWindow: () => void;
    shutdown: () => void;
    setVolume: (level: number) => void;
    toggleMute: (isMuted: boolean) => void;
  };
}

/// <reference types="electron" />

interface Window {
  osAPI: {
    minimizeWindow: () => void;
    maximizeWindow: () => void;
    closeWindow: () => void;
  };
}

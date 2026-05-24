import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

// En entornos ESM, definimos __dirname de manera compatible
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

/**
 * Inicializa la ventana principal frameless y transparente.
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    transparent: true,
    webPreferences: {
      webviewTag: true, // Requerido para incrustar el navegador real
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ---- IPC Event Handlers (Control de Ventana Principal) ----

ipcMain.on('window:minimize', (): void => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('window:maximize', (): void => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window:close', (): void => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.on('system:shutdown', (): void => {
  app.quit();
});

// ---- IPC Audio Event Handlers (Control de Volumen Global) ----
ipcMain.on('audio:set-volume', (_event, level: number): void => {
  console.log(`[Audio IPC] Volume set to: ${level * 100}%`);
});

ipcMain.on('audio:toggle-mute', (_event, isMuted: boolean): void => {
  if (mainWindow) {
    mainWindow.webContents.setAudioMuted(isMuted);
    console.log(`[Audio IPC] Muted status set to: ${isMuted}`);
  }
});

// ---- Ciclo de vida del Proceso Principal ----

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

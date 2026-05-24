# AntorOS - Desktop Edition 🖥️🌀

[![Vue](https://img.shields.io/badge/Vue.js-3.4-4fc08d?logo=vue.js)](https://vuejs.org/)
[![Electron](https://img.shields.io/badge/Electron-29.1-47848F?logo=electron)](https://www.electronjs.org/)
[![Go](https://img.shields.io/badge/Go-1.24-00ADD8?logo=go)](https://go.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AntorOS** es un simulador de sistema operativo futurista construido con tecnologías web modernas, diseñado para ofrecer una experiencia de escritorio inmersiva con capacidades de monitorización de hardware en tiempo real.

---

## 🚀 Características Principales

- **Dashboard de Hardware**: Visualización en tiempo real del uso de CPU y RAM gracias a un Daemon nativo escrito en Go.
- **Ecosistema de Apps**: Suite completa de aplicaciones integradas (Navegador, Terminal, Gestor de Archivos, Notas, etc.).
- **Diseño Gamer-Neon**: Interfaz estética con animaciones fluidas y personalización profunda de temas.
- **Arquitectura Híbrida**: Frontend reactivo en Vue 3 y un "Kernel" backend en Go comunicado vía WebSockets para acceso a hardware real.
- **Integración Nativa**: Gracias a Electron, el sistema tiene acceso a APIs de bajo nivel, control de ventanas frameless, y gestión de energía.

---

## 🏗️ Arquitectura del Sistema

```mermaid
graph TD
    subgraph "Espacio de Usuario (Frontend)"
        A[Electron App] --> B[Vue 3 / Vite]
        B --> C[Apps / SYSTEM_APPS]
        B --> D[Pinia Stores]
    end

    subgraph "Puente de Sistema (Main Process)"
        A ---|IPC Bridge| E[Electron Main]
        E ---|Procesos| F[Control de Ventanas/Audio]
    end

    subgraph "Capa de Hardware (Go Daemon)"
        G[Go Kernel] --> H[Gopsutil / Syscalls]
        G --> I[WS Server :8080]
    end

    B <--- WebSockets ---> I
    E ---|Preload| B
```

---

## 📂 Estructura del Proyecto

- `electron/`: Punto de entrada y configuración de Electron (Main & Preload).
- `src/`: Lógica del frontend Vue 3, componentes, stores de Pinia y estilos CSS.
- `daemon/`: "Kernel" del sistema escrito en Go que gestiona la telemetría del hardware.
- `dist-electron/`: Archivos compilados listos para ejecución en producción.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [pnpm](https://pnpm.io/) (recomendado) o npm
- [Go](https://go.dev/) (v1.24 o superior) para el Daemon de hardware

---

## ⚡ Procedimiento de Instalación y Ejecución

Sigue estos pasos para poner en marcha el proyecto:

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/AntorOS-Desktop-Edition.git
cd AntorOS-Desktop-Edition
```

### 2. Instalar dependencias del Frontend
```bash
pnpm install
```

### 3. Ejecutar el sistema (Modo Desarrollo)

Para que el sistema funcione completamente, se requiere ejecutar tres procesos en terminales separadas:

- **Paso A: Iniciar el Servidor de Desarrollo (Vite)**
  ```bash
  pnpm dev:vue
  ```
  *(Este comando sirve el frontend en http://localhost:3000)*

- **Paso B: Iniciar el Daemon de Hardware (Go Kernel)**
  ```bash
  pnpm dev:daemon
  ```
  *(Este comando activa el puente con el hardware real vía WebSocket)*

- **Paso C: Iniciar la Aplicación de Escritorio (Electron)**
  ```bash
  pnpm dev:electron
  ```
  *(Este comando abre la ventana nativa de AntorOS)*

---

## 🏗️ Empaquetado para Producción

Si deseas generar los binarios finales:

1. **Construir el Frontend y Electron**:
   ```bash
   pnpm build
   ```
2. **Compilar el Daemon de Go**:
   ```bash
   cd daemon
   go build -o antor-os-daemon
   ```

## 📱 Aplicaciones Incluidas

| App | Descripción |
| :--- | :--- |
| **🌐 Navegador** | Navegación web avanzada integrada. |
| **💻 Terminal** | Interfaz de comandos nativa de AntorOS. |
| **📁 Archivos** | Gestión y exploración de archivos virtuales. |
| **📊 Monitor** | Estadísticas de hardware (CPU/RAM) en vivo. |
| **⚙️ Ajustes** | Centro de control para personalización y temas. |

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Hecho con ❤️ para la clase de Sistemas Operativos
</p>


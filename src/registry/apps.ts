import {
  Globe,
  TerminalSquare,
  Settings,
  Activity,
  FolderOpen,
  FileText,
  Camera,
  Wifi,
  BookOpen,
  Calculator,
  Calendar,
  Clock,
  Mic,
  ShoppingBag,
  Music,
  Code,
  Gauge,
  type LucideIcon
} from 'lucide-vue-next';

export interface AppRegistryEntry {
  id: string;
  name: string;      // Component name
  title: string;     // Display title
  icon: LucideIcon;
  defaultWidth?: number;
  defaultHeight?: number;
  isCore: boolean;
  description: string;
  developer: string;
  size: string;
}

// Catálogo centralizado de aplicaciones del sistema operativo AntorUI
export const SYSTEM_APPS: AppRegistryEntry[] = [
  {
    id: 'browser',
    name: 'BrowserApp',
    title: 'Navegador Web',
    icon: Globe,
    defaultWidth: 1000,
    defaultHeight: 600,
    isCore: true,
    description: 'Navegador web virtual de alta velocidad.',
    developer: 'AntorOS Core Team',
    size: '85 MB'
  },
  {
    id: 'terminal',
    name: 'TerminalApp',
    title: 'Terminal de Comando',
    icon: TerminalSquare,
    defaultWidth: 700,
    defaultHeight: 450,
    isCore: true,
    description: 'Línea de comandos nativa de AntorOS.',
    developer: 'AntorOS Core Team',
    size: '12 MB'
  },
  {
    id: 'settings',
    name: 'SettingsApp',
    title: 'Configuración',
    icon: Settings,
    defaultWidth: 800,
    defaultHeight: 500,
    isCore: true,
    description: 'Centro de control de personalización y dispositivos.',
    developer: 'AntorOS Core Team',
    size: '42 MB'
  },
  {
    id: 'monitor',
    name: 'MonitorApp',
    title: 'Monitor de Sistema',
    icon: Activity,
    defaultWidth: 850,
    defaultHeight: 550,
    isCore: true,
    description: 'Monitorización de CPU, RAM y telemetrías.',
    developer: 'AntorOS Core Team',
    size: '18 MB'
  },
  {
    id: 'files',
    name: 'FilesApp',
    title: 'Gestor de Archivos',
    icon: FolderOpen,
    defaultWidth: 900,
    defaultHeight: 550,
    isCore: true,
    description: 'Explorador y gestor de archivos virtual.',
    developer: 'AntorOS Core Team',
    size: '34 MB'
  },
  {
    id: 'notes',
    name: 'NotesApp',
    title: 'Editor de Notas',
    icon: FileText,
    defaultWidth: 700,
    defaultHeight: 520,
    isCore: true,
    description: 'Editor de notas de texto plano.',
    developer: 'AntorOS Core Team',
    size: '8 MB'
  },
  {
    id: 'camera',
    name: 'CameraApp',
    title: 'Cámara Cyber',
    icon: Camera,
    defaultWidth: 640,
    defaultHeight: 560,
    isCore: true,
    description: 'Aplicación de cámara interactiva cyberpunk.',
    developer: 'AntorOS Core Team',
    size: '22 MB'
  },
  {
    id: 'network',
    name: 'NetworkApp',
    title: 'Centro de Redes',
    icon: Wifi,
    defaultWidth: 750,
    defaultHeight: 480,
    isCore: true,
    description: 'Gestor y escáner de redes virtuales.',
    developer: 'AntorOS Core Team',
    size: '15 MB'
  },
  {
    id: 'office',
    name: 'OfficeApp',
    title: 'Suite de Oficina',
    icon: BookOpen,
    defaultWidth: 950,
    defaultHeight: 600,
    isCore: true,
    description: 'Suite de oficina y lectura de documentos.',
    developer: 'AntorOS Core Team',
    size: '95 MB'
  },
  {
    id: 'calculator',
    name: 'CalculatorApp',
    title: 'Calculadora',
    icon: Calculator,
    defaultWidth: 350,
    defaultHeight: 490,
    isCore: true,
    description: 'Calculadora científica gamer.',
    developer: 'AntorOS Core Team',
    size: '6 MB'
  },
  {
    id: 'calendar',
    name: 'CalendarApp',
    title: 'Calendario',
    icon: Calendar,
    defaultWidth: 720,
    defaultHeight: 540,
    isCore: true,
    description: 'Organizador y calendario digital.',
    developer: 'AntorOS Core Team',
    size: '14 MB'
  },
  {
    id: 'clock',
    name: 'ClockApp',
    title: 'Reloj y Cronómetro',
    icon: Clock,
    defaultWidth: 500,
    defaultHeight: 420,
    isCore: true,
    description: 'Reloj mundial, alarmas y temporizador.',
    developer: 'AntorOS Core Team',
    size: '10 MB'
  },
  {
    id: 'recorder',
    name: 'RecorderApp',
    title: 'Grabadora de Voz',
    icon: Mic,
    defaultWidth: 400,
    defaultHeight: 500,
    isCore: true,
    description: 'Grabadora de audio y espectrógrafo.',
    developer: 'AntorOS Core Team',
    size: '16 MB'
  },
  {
    id: 'store',
    name: 'StoreApp',
    title: 'App Store',
    icon: ShoppingBag,
    defaultWidth: 900,
    defaultHeight: 600,
    isCore: true,
    description: 'Tienda oficial de aplicaciones AntorOS.',
    developer: 'AntorOS Core Team',
    size: '28 MB'
  },
  {
    id: 'neonplayer',
    name: 'NeonPlayerApp',
    title: 'Neon Player',
    icon: Music,
    defaultWidth: 750,
    defaultHeight: 500,
    isCore: false,
    description: 'Reproductor de música futurista con espectrómetro reactivo.',
    developer: 'antorlok Systems',
    size: '45 MB'
  },
  {
    id: 'cybercode',
    name: 'CyberCodeApp',
    title: 'CyberCode',
    icon: Code,
    defaultWidth: 850,
    defaultHeight: 550,
    isCore: false,
    description: 'Editor de código moderno con coloreado de sintaxis neón.',
    developer: 'antorlok Systems',
    size: '56 MB'
  },
  {
    id: 'sysbench',
    name: 'SysBenchApp',
    title: 'SysBench',
    icon: Gauge,
    defaultWidth: 650,
    defaultHeight: 480,
    isCore: false,
    description: 'Herramienta de pruebas de rendimiento extremo del kernel.',
    developer: 'antorlok Labs',
    size: '30 MB'
  }
];

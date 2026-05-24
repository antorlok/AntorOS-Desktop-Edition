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
  type LucideIcon,
  // Iconos de control de estado y energía
  WifiOff,
  BatteryCharging,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  Volume2,
  VolumeX,
  Power
} from 'lucide-vue-next';

export interface AppRegistryEntry {
  id: string;
  name: string;      // Component name
  title: string;     // Display title
  icon: LucideIcon;
  defaultWidth?: number;
  defaultHeight?: number;
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
  },
  {
    id: 'terminal',
    name: 'TerminalApp',
    title: 'Terminal de Comando',
    icon: TerminalSquare,
    defaultWidth: 700,
    defaultHeight: 450,
  },
  {
    id: 'settings',
    name: 'SettingsApp',
    title: 'Configuración',
    icon: Settings,
    defaultWidth: 800,
    defaultHeight: 500,
  },
  {
    id: 'monitor',
    name: 'MonitorApp',
    title: 'Monitor de Sistema',
    icon: Activity,
    defaultWidth: 850,
    defaultHeight: 550,
  },
  {
    id: 'files',
    name: 'FilesApp',
    title: 'Gestor de Archivos',
    icon: FolderOpen,
    defaultWidth: 900,
    defaultHeight: 550,
  },
  {
    id: 'notes',
    name: 'NotesApp',
    title: 'Editor de Notas',
    icon: FileText,
    defaultWidth: 700,
    defaultHeight: 520,
  },
  {
    id: 'camera',
    name: 'CameraApp',
    title: 'Cámara Cyber',
    icon: Camera,
    defaultWidth: 640,
    defaultHeight: 560,
  },
  {
    id: 'network',
    name: 'NetworkApp',
    title: 'Centro de Redes',
    icon: Wifi,
    defaultWidth: 750,
    defaultHeight: 480,
  },
  {
    id: 'office',
    name: 'OfficeApp',
    title: 'Suite de Oficina',
    icon: BookOpen,
    defaultWidth: 950,
    defaultHeight: 600,
  },
  {
    id: 'calculator',
    name: 'CalculatorApp',
    title: 'Calculadora',
    icon: Calculator,
    defaultWidth: 350,
    defaultHeight: 490,
  },
  {
    id: 'calendar',
    name: 'CalendarApp',
    title: 'Calendario',
    icon: Calendar,
    defaultWidth: 720,
    defaultHeight: 540,
  },
  {
    id: 'clock',
    name: 'ClockApp',
    title: 'Reloj y Cronómetro',
    icon: Clock,
    defaultWidth: 500,
    defaultHeight: 420,
  },
  {
    id: 'recorder',
    name: 'RecorderApp',
    title: 'Grabadora de Voz',
    icon: Mic,
    defaultWidth: 400,
    defaultHeight: 500,
  },
];

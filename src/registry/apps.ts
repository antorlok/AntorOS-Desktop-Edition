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
  type LucideIcon,
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
    defaultWidth: 600,
    defaultHeight: 500,
  },
  {
    id: 'camera',
    name: 'CameraApp',
    title: 'Cámara Cyber',
    icon: Camera,
    defaultWidth: 640,
    defaultHeight: 480,
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
];

import { Globe, Terminal, Settings, type LucideIcon } from 'lucide-vue-next';

export interface AppRegistryEntry {
  id: string;
  name: string;      // Component name
  title: string;     // Display title
  icon: LucideIcon;
  defaultWidth?: number;
  defaultHeight?: number;
}

// Catálogo centralizado del sistema operativo
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
    icon: Terminal,
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
];

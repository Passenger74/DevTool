import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeName } from './types';

export const THEMES: Record<ThemeName, Theme> = {
  classic: {
    name: 'classic',
    label: 'Clásico',
    primary: '#0d9488',
    primaryHover: '#0f766e',
    primaryLight: '#ccfbf1',
    accent: '#f97316',
    accentHover: '#ea580c',
    accentLight: '#ffedd5',
    gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)',
    emoji: '🌊',
  },
  ocean: {
    name: 'ocean',
    label: 'Oceánico',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    primaryLight: '#e0f2fe',
    accent: '#06b6d4',
    accentHover: '#0891b2',
    accentLight: '#cffafe',
    gradient: 'linear-gradient(135deg, #0284c7, #06b6d4)',
    emoji: '🌊',
  },
  forest: {
    name: 'forest',
    label: 'Bosque',
    primary: '#059669',
    primaryHover: '#047857',
    primaryLight: '#d1fae5',
    accent: '#65a30d',
    accentHover: '#4d7c0f',
    accentLight: '#ecfccb',
    gradient: 'linear-gradient(135deg, #059669, #65a30d)',
    emoji: '🌲',
  },
  sunset: {
    name: 'sunset',
    label: 'Atardecer',
    primary: '#e11d48',
    primaryHover: '#be123c',
    primaryLight: '#ffe4e6',
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentLight: '#fef3c7',
    gradient: 'linear-gradient(135deg, #e11d48, #f59e0b)',
    emoji: '🌅',
  },
  mono: {
    name: 'mono',
    label: 'Monocromo',
    primary: '#374151',
    primaryHover: '#1f2937',
    primaryLight: '#f3f4f6',
    accent: '#6b7280',
    accentHover: '#4b5563',
    accentLight: '#e5e7eb',
    gradient: 'linear-gradient(135deg, #374151, #6b7280)',
    emoji: '⚫',
  },
  lavender: {
    name: 'lavender',
    label: 'Lavanda',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    primaryLight: '#ede9fe',
    accent: '#ec4899',
    accentHover: '#db2777',
    accentLight: '#fce7f3',
    gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    emoji: '💜',
  },
};

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('taskflow_theme');
    return (saved as ThemeName) || 'classic';
  });

  const theme = THEMES[themeName];

  useEffect(() => {
    localStorage.setItem('taskflow_theme', themeName);
    // Aplicar variables CSS al root
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-primary-hover', theme.primaryHover);
    root.style.setProperty('--theme-primary-light', theme.primaryLight);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-accent-hover', theme.accentHover);
    root.style.setProperty('--theme-accent-light', theme.accentLight);
    root.style.setProperty('--theme-gradient', theme.gradient);
  }, [themeName, theme]);

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themeName,
      setTheme,
      themes: Object.values(THEMES),
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

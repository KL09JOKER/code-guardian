import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeName = 'dark-tech' | 'cyber-green' | 'midnight-purple' | 'crimson-red';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'backdoorscanner-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return (saved as ThemeName) || 'dark-tech';
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark-tech', 'theme-cyber-green', 'theme-midnight-purple', 'theme-crimson-red');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export const THEMES: { value: ThemeName; label: string; description: string }[] = [
  { value: 'dark-tech', label: 'Dark Tech', description: 'Electric blue & pink neon' },
  { value: 'cyber-green', label: 'Cyber Green', description: 'Classic hacker aesthetic' },
  { value: 'midnight-purple', label: 'Midnight Purple', description: 'Deep violet tones' },
  { value: 'crimson-red', label: 'Crimson Red', description: 'Blood red & ember glow' },
];

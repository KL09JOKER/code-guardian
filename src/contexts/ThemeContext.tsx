import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeName = 'dark-tech' | 'cyber-green' | 'midnight-purple' | 'crimson-red' | 'ember-orange' | 'matrix-green' | 'stealth-black' | 'blood-shadow';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  autoRiskTheme: boolean;
  setAutoRiskTheme: (enabled: boolean) => void;
  applyRiskTheme: (riskScore: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'backdoorscanner-theme';
const AUTO_RISK_KEY = 'backdoorscanner-auto-risk-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return (saved as ThemeName) || 'dark-tech';
  });

  const [autoRiskTheme, setAutoRiskThemeState] = useState(() => {
    return localStorage.getItem(AUTO_RISK_KEY) === 'true';
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  };

  const setAutoRiskTheme = (enabled: boolean) => {
    setAutoRiskThemeState(enabled);
    localStorage.setItem(AUTO_RISK_KEY, String(enabled));
    if (!enabled) {
      // Restore saved theme
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) applyThemeClass(saved as ThemeName);
    }
  };

  const applyRiskTheme = (riskScore: number) => {
    if (!autoRiskTheme) return;
    let riskTheme: ThemeName;
    if (riskScore >= 70) {
      riskTheme = 'crimson-red';
    } else if (riskScore >= 40) {
      riskTheme = 'ember-orange';
    } else {
      riskTheme = 'matrix-green';
    }
    applyThemeClass(riskTheme);
  };

  const applyThemeClass = (t: ThemeName) => {
    const root = document.documentElement;
    root.classList.remove('theme-dark-tech', 'theme-cyber-green', 'theme-midnight-purple', 'theme-crimson-red', 'theme-ember-orange', 'theme-matrix-green', 'theme-stealth-black', 'theme-blood-shadow');
    root.classList.add(`theme-${t}`);
  };

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, autoRiskTheme, setAutoRiskTheme, applyRiskTheme }}>
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
  { value: 'ember-orange', label: 'Ember Orange', description: 'Warm amber & fire tones' },
  { value: 'matrix-green', label: 'Matrix Green', description: 'Neon green terminal style' },
  { value: 'stealth-black', label: 'Stealth Black', description: 'Pure black OLED aesthetic' },
];

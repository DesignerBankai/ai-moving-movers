/**
 * Theme Context — toggles between design styles.
 *
 * Supports:
 *  - glassmorphism: dreamy gradient + glass cards
 *  - clean: flat white UI with subtle shadows
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

export type DesignTheme = 'glassmorphism' | 'clean';

interface ThemeContextValue {
  theme: DesignTheme;
  glassmorphism: boolean;
  setTheme: (t: DesignTheme) => void;
  toggleGlassmorphism: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'clean',
  glassmorphism: false,
  setTheme: () => {},
  toggleGlassmorphism: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<DesignTheme>('clean');

  const toggleGlassmorphism = useCallback(() => {
    setTheme(prev => prev === 'glassmorphism' ? 'clean' : 'glassmorphism');
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme,
      glassmorphism: theme === 'glassmorphism',
      setTheme,
      toggleGlassmorphism,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

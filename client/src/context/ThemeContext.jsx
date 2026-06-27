/**
 * ThemeContext — dark-first theme provider for future-proofing.
 * Currently only supports dark mode (the default Solace theme).
 */
import { createContext, useState, useCallback } from 'react';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme] = useState('dark');

  const value = {
    theme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

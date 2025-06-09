import { createContext } from 'react';

export interface ThemeContextType {
  theme: 'light' | 'dark'; 
  toggleTheme: () => void; 
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => console.warn('toggleTheme function not yet implemented'),
});
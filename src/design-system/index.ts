/**
 * AI Moving — Design System
 * v1.0
 *
 * Import everything from here:
 *   import { colors, spacing, Text, Button, Input } from '@/design-system';
 */

// Tokens
export { colors } from './tokens/colors';
export { spacing } from './tokens/spacing';
export { borders } from './tokens/borders';
export { typography, fontFamily } from './tokens/typography';

// Components
export { Text } from './components/Text';
export { Button } from './components/Button';
export { SwipeButton } from './components/SwipeButton';
export { Input } from './components/Input';
export { StatusBarMock } from './components/StatusBarMock';
export { NumPadMock } from './components/NumPadMock';
export { ProgressBar } from './components/ProgressBar';
export { Chip } from './components/Chip';
export { Toggle } from './components/Toggle';
export { Navbar } from './components/Navbar';
export {
  DreamyLayout,
  glassCard,
  glassCardStrong,
  glassCardSubtle,
  glassInput,
  glassNavbar,
  DREAMY_BG,
} from './components/DreamyLayout';

// Theme
export { ThemeProvider, useTheme } from './ThemeContext';
export type { DesignTheme } from './ThemeContext';

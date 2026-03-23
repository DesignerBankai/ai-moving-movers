/**
 * AI Moving — Typography Tokens
 * Design System v1.0
 *
 * Primary font: Inter
 * Accent font: Chivo Mono (buttons, bullets)
 */

import { Platform } from 'react-native';

// Font families
// Using system fonts for now, will switch to Inter/Chivo Mono when loaded via Expo fonts
export const fontFamily = {
  // Inter — fallback to system font until custom fonts are loaded
  primary: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'System' }),
  primaryBold: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'System' }),
  primaryMedium: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'System' }),
  primarySemiBold: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'System' }),

  // Chivo Mono — fallback to monospace until custom fonts are loaded
  mono: Platform.select({ web: 'monospace', default: 'System' }),
  monoMedium: Platform.select({ web: 'monospace', default: 'System' }),
} as const;

// Helper: convert percentage line-height to multiplier
// e.g., 100% = 1.0, 130% = 1.3, 140% = 1.4
const lh = (fontSize: number, percentage: number) =>
  Math.round(fontSize * (percentage / 100));

// Helper: convert percentage letter-spacing to pixels
// React Native uses pixels for letterSpacing
const ls = (fontSize: number, percentage: number) =>
  parseFloat((fontSize * (percentage / 100)).toFixed(2));

export const typography = {
  // Display — 80, Bold, 100%, -4%
  display: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 80,
    lineHeight: lh(80, 100),
    letterSpacing: ls(80, -4),
    fontWeight: '700' as const,
  },

  // H1 — 48, Bold, 100%, -4%
  h1: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 48,
    lineHeight: lh(48, 100),
    letterSpacing: ls(48, -4),
    fontWeight: '700' as const,
  },

  // H2 — 40, Bold, 100%, -4%
  h2: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 40,
    lineHeight: lh(40, 100),
    letterSpacing: ls(40, -4),
    fontWeight: '700' as const,
  },

  // H3 — 32, Bold, 130%, -4%
  h3: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 32,
    lineHeight: lh(32, 130),
    letterSpacing: ls(32, -4),
    fontWeight: '700' as const,
  },

  // H4 — 24, Bold, 150%, -2%
  h4: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 24,
    lineHeight: lh(24, 150),
    letterSpacing: ls(24, -2),
    fontWeight: '700' as const,
  },

  // Body Large Bold — 20, Bold, 125%, -2%
  bodyLgBold: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 20,
    lineHeight: lh(20, 125),
    letterSpacing: ls(20, -2),
    fontWeight: '700' as const,
  },

  // Body Large — 20, Regular, 130%, -2%
  bodyLg: {
    fontFamily: fontFamily.primary,
    fontSize: 20,
    lineHeight: lh(20, 130),
    letterSpacing: ls(20, -2),
    fontWeight: '400' as const,
  },

  // Body Medium Semibold — 18, Semibold, 140%, -2%
  bodyMdSemibold: {
    fontFamily: fontFamily.primarySemiBold,
    fontSize: 18,
    lineHeight: lh(18, 140),
    letterSpacing: ls(18, -2),
    fontWeight: '600' as const,
  },

  // Body Medium — 18, Regular, 140%, -2%
  bodyMd: {
    fontFamily: fontFamily.primary,
    fontSize: 18,
    lineHeight: lh(18, 140),
    letterSpacing: ls(18, -2),
    fontWeight: '400' as const,
  },

  // Body Small — 16, Regular, 140%, -2%
  bodySm: {
    fontFamily: fontFamily.primary,
    fontSize: 16,
    lineHeight: lh(16, 140),
    letterSpacing: ls(16, -2),
    fontWeight: '400' as const,
  },

  // Bullit Large — Chivo Mono, 14, Bold, 100%, -2%
  bullitLg: {
    fontFamily: fontFamily.mono,
    fontSize: 14,
    lineHeight: lh(14, 100),
    letterSpacing: ls(14, -2),
    fontWeight: '700' as const,
  },

  // Bullit — Chivo Mono, 12, Medium, 100%, -2%
  bullit: {
    fontFamily: fontFamily.monoMedium,
    fontSize: 12,
    lineHeight: lh(12, 100),
    letterSpacing: ls(12, -2),
    fontWeight: '500' as const,
  },
} as const;

export type TypographyToken = typeof typography;

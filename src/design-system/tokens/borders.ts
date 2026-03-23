/**
 * AI Moving — Border Tokens
 * Design System v1.0
 *
 * Unified border-radius: 12px for all interactive elements
 * No shadows
 */

export const borders = {
  radius: {
    none: 0,
    sm: 8,
    md: 12,
    default: 12,
    lg: 20,
    xl: 24,
    full: 9999,
  },
} as const;

export type BorderToken = typeof borders;

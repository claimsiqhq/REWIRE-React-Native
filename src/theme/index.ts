/**
 * REWIRE Theme System
 * Centralized theme exports for the application
 */

export { colors, lightColors, type ColorName } from './colors';
export { typography, type TypographyVariant } from './typography';
export { spacing, borderRadius, layout, type SpacingValue, type BorderRadiusValue } from './spacing';
export { shadows, type ShadowName } from './shadows';

// Convenience theme object
import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, layout } from './spacing';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  layout,
  shadows,
} as const;

export type Theme = typeof theme;

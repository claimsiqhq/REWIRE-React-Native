/**
 * REWIRE Spacing System
 * Consistent spacing scale for layout and components
 */

export const spacing = {
  // Base spacing values (in pixels)
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
  '7xl': 96,
} as const;

// Border radius values
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  base: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

// Common layout dimensions
export const layout = {
  // Screen padding
  screenPaddingHorizontal: spacing.base,
  screenPaddingVertical: spacing.lg,

  // Card padding
  cardPadding: spacing.base,
  cardPaddingSmall: spacing.md,

  // Button heights
  buttonHeightSmall: 32,
  buttonHeightMedium: 40,
  buttonHeightLarge: 48,

  // Input heights
  inputHeight: 44,
  inputHeightLarge: 52,

  // Icon sizes
  iconSmall: 16,
  iconMedium: 20,
  iconLarge: 24,
  iconXLarge: 32,

  // Avatar sizes
  avatarSmall: 32,
  avatarMedium: 40,
  avatarLarge: 56,
  avatarXLarge: 80,

  // Bottom tab bar
  tabBarHeight: 60,
  tabBarIconSize: 24,

  // Header
  headerHeight: 56,

  // Max width for content on larger screens
  maxContentWidth: 500,
} as const;

export type SpacingValue = keyof typeof spacing;
export type BorderRadiusValue = keyof typeof borderRadius;

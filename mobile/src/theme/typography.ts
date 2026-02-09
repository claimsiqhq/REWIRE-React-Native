import { Platform, TextStyle } from 'react-native';

/**
 * REWIRE Typography System
 * Based on Montserrat (body) and Poppins (display)
 */

// Font families - use system fonts as fallback
// For production, you'd load custom fonts with expo-font
const fontFamily = {
  sans: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  display: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

// Font weights
const fontWeight = {
  normal: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

// Font sizes with line heights
export const typography = {
  // Display sizes (for headers)
  displayLarge: {
    fontFamily: fontFamily.display,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: fontWeight.bold,
    letterSpacing: 2,
  } as TextStyle,

  displayMedium: {
    fontFamily: fontFamily.display,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
  } as TextStyle,

  displaySmall: {
    fontFamily: fontFamily.display,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1,
  } as TextStyle,

  // Headings
  h1: {
    fontFamily: fontFamily.display,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
  } as TextStyle,

  h2: {
    fontFamily: fontFamily.display,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1,
  } as TextStyle,

  h3: {
    fontFamily: fontFamily.display,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  } as TextStyle,

  h4: {
    fontFamily: fontFamily.display,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontFamily: fontFamily.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeight.normal,
  } as TextStyle,

  body: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: fontWeight.normal,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeight.normal,
  } as TextStyle,

  // Labels
  labelLarge: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
  } as TextStyle,

  label: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
  } as TextStyle,

  labelSmall: {
    fontFamily: fontFamily.sans,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,

  // Button text
  button: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  } as TextStyle,

  buttonSmall: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  } as TextStyle,

  // Caption/helper text
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.normal,
  } as TextStyle,

  // Monospace (for code, timers, etc.)
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeight.normal,
  } as TextStyle,
};

export type TypographyVariant = keyof typeof typography;

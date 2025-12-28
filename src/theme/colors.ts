/**
 * REWIRE Color Palette
 * Nature-inspired dark theme with vibrant accents
 */

export const colors = {
  // Core Brand Colors
  nightForest: '#1E1E2E',      // Primary background
  deepPine: '#272738',          // Card background
  forestFloor: '#3A3A4A',       // Borders
  sage: '#B0D4C1',              // Soft green-gray accent
  birch: '#FAF8F3',             // Warm cream white
  ember: '#F47D20',             // Vibrant orange accent

  // Semantic Colors
  background: '#1E1E2E',
  foreground: '#F5F3EE',
  card: '#272738',
  cardForeground: '#F5F3EE',
  border: '#3D3D4D',
  input: '#2A2A38',

  // Primary/Secondary
  primary: '#FAF8F3',
  primaryForeground: '#1E1E2E',
  secondary: '#B0D4C1',
  secondaryForeground: '#1E1E2E',

  // Muted
  muted: '#35354A',
  mutedForeground: '#9BA3A0',

  // Accent
  accent: '#14B8A6',
  accentForeground: '#FFFFFF',

  // Status Colors
  success: '#22C55E',
  successForeground: '#FFFFFF',
  warning: '#F59E0B',
  warningForeground: '#1A1A1A',
  info: '#14B8A6',
  infoForeground: '#FFFFFF',
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',

  // Vibrant Accents
  glow: '#FFD666',
  gold: '#EAB308',
  teal: '#14B8A6',
  coral: '#F87171',
  violet: '#8B5CF6',

  // Mood Colors
  moodAmazing: '#FACC15',       // Radiant gold-yellow
  moodGreat: '#22C55E',         // Fresh green
  moodGood: '#0EA5E9',          // Calm sky blue
  moodOkay: '#6B7280',          // Neutral slate
  moodRough: '#EF4444',         // Soft coral-red

  // Chart Colors
  chart1: '#14B8A6',
  chart2: '#22C55E',
  chart3: '#F47D20',
  chart4: '#8B5CF6',
  chart5: '#EAB308',

  // Transparent variants
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

// Light mode colors (for future use)
export const lightColors = {
  nightForest: '#FDFBF7',
  deepPine: '#FFFFFF',
  forestFloor: '#E5E2DB',
  sage: '#4A8B6E',
  birch: '#1E1E2E',
  ember: '#EA6B0D',

  background: '#FDFBF7',
  foreground: '#1E1E2E',
  card: '#FFFFFF',
  cardForeground: '#1E1E2E',
  border: '#E5E2DB',
  input: '#F5F3EE',

  primary: '#14A89A',
  primaryForeground: '#FFFFFF',
  secondary: '#E8F5EE',
  secondaryForeground: '#1E1E2E',

  muted: '#E8F5EE',
  mutedForeground: '#666666',

  accent: '#14A89A',
  accentForeground: '#FFFFFF',
} as const;

export type ColorName = keyof typeof colors;

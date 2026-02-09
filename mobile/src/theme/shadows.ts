import { Platform, ViewStyle } from 'react-native';
import { colors } from './colors';

/**
 * REWIRE Shadow System
 * Platform-specific shadow implementations
 */

type ShadowStyle = Pick<ViewStyle,
  | 'shadowColor'
  | 'shadowOffset'
  | 'shadowOpacity'
  | 'shadowRadius'
  | 'elevation'
>;

// Helper to create cross-platform shadows
const createShadow = (
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number,
  color: string = colors.black
): ShadowStyle => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: Platform.OS === 'android' ? elevation : 0,
});

export const shadows = {
  none: createShadow(0, 0, 0, 0),

  // Subtle shadow for cards
  sm: createShadow(1, 2, 0.1, 1),

  // Default shadow
  md: createShadow(2, 4, 0.15, 3),

  // Elevated shadow
  lg: createShadow(4, 8, 0.2, 6),

  // Strong shadow
  xl: createShadow(8, 16, 0.25, 10),

  // Extra strong shadow
  '2xl': createShadow(12, 24, 0.3, 15),

  // Glow effects (colored shadows)
  glowSuccess: createShadow(0, 12, 0.4, 8, colors.success),
  glowWarning: createShadow(0, 12, 0.4, 8, colors.warning),
  glowAccent: createShadow(0, 12, 0.4, 8, colors.accent),
  glowGold: createShadow(0, 12, 0.4, 8, colors.gold),
  glowEmber: createShadow(0, 12, 0.5, 8, colors.ember),

  // Card hover effect (for pressable cards)
  cardHover: createShadow(8, 20, 0.15, 12),
} as const;

export type ShadowName = keyof typeof shadows;

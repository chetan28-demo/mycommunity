import { Platform } from 'react-native';
import { fontSize } from '../utils/responsiveHelper';

// Centralized Typography System
export const FONT_FAMILIES = {
  primary: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  }),
  secondary: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System',
  }),
  mono: Platform.select({
    ios: 'SF Mono',
    android: 'Roboto Mono',
    default: 'monospace',
  }),
};

export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
};

export const FONT_SIZES = {
  xs: fontSize(12),
  sm: fontSize(14),
  base: fontSize(16),
  lg: fontSize(18),
  xl: fontSize(20),
  '2xl': fontSize(24),
  '3xl': fontSize(30),
  '4xl': fontSize(36),
  '5xl': fontSize(48),
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

// Typography Styles
export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES['4xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES['4xl'] * LINE_HEIGHTS.tight,
  },
  h2: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES['3xl'] * LINE_HEIGHTS.tight,
  },
  h3: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES['2xl'] * LINE_HEIGHTS.tight,
  },
  h4: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.xl * LINE_HEIGHTS.normal,
  },
  h5: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.normal,
  },
  h6: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.base * LINE_HEIGHTS.normal,
  },

  // Body Text
  body1: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.base * LINE_HEIGHTS.normal,
  },
  body2: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
  },

  // Captions and Labels
  caption: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.normal,
  },
  label: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
  },

  // Buttons
  button: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.base * LINE_HEIGHTS.tight,
  },
  buttonSmall: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.tight,
  },
  buttonLarge: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.tight,
  },
};
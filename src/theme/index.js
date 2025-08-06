export { TYPOGRAPHY, FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES, LINE_HEIGHTS } from './typography';
export { COLORS, LIGHT_THEME, DARK_THEME } from './colors';
export { SPACING, RESPONSIVE_SPACING, COMPONENT_SPACING, SAFE_AREA } from './spacing';
export { SHADOWS, CARD_SHADOWS, BUTTON_SHADOWS } from './shadows';

// Combined theme object
export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  shadows: SHADOWS,
  components: COMPONENT_SPACING,
};
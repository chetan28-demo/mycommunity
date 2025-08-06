import { responsiveWidth, responsiveHeight } from '../utils/responsiveHelper';

// 8px base spacing system
const BASE_SPACING = 8;

export const SPACING = {
  xs: BASE_SPACING * 0.5,    // 4px
  sm: BASE_SPACING,          // 8px
  md: BASE_SPACING * 2,      // 16px
  lg: BASE_SPACING * 3,      // 24px
  xl: BASE_SPACING * 4,      // 32px
  '2xl': BASE_SPACING * 6,   // 48px
  '3xl': BASE_SPACING * 8,   // 64px
  '4xl': BASE_SPACING * 12,  // 96px
  '5xl': BASE_SPACING * 16,  // 128px
};

// Responsive spacing
export const RESPONSIVE_SPACING = {
  xs: responsiveWidth(1),
  sm: responsiveWidth(2),
  md: responsiveWidth(4),
  lg: responsiveWidth(6),
  xl: responsiveWidth(8),
  '2xl': responsiveWidth(12),
  '3xl': responsiveWidth(16),
};

// Component specific spacing
export const COMPONENT_SPACING = {
  // Cards
  cardPadding: SPACING.md,
  cardMargin: SPACING.sm,
  cardRadius: 12,

  // Buttons
  buttonPadding: {
    horizontal: SPACING.lg,
    vertical: SPACING.md,
  },
  buttonRadius: 8,

  // Inputs
  inputPadding: {
    horizontal: SPACING.md,
    vertical: SPACING.md,
  },
  inputRadius: 8,

  // Lists
  listItemPadding: SPACING.md,
  listItemMargin: SPACING.sm,

  // Headers
  headerPadding: {
    horizontal: SPACING.md,
    vertical: SPACING.lg,
  },

  // Modals
  modalPadding: SPACING.lg,
  modalRadius: 16,
};

// Safe area spacing
export const SAFE_AREA = {
  top: responsiveHeight(6),
  bottom: responsiveHeight(3),
  horizontal: responsiveWidth(4),
};
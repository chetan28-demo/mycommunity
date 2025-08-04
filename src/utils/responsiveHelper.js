import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced screen size detection
export const isPixel2 = screenWidth <= 415;
export const isSmallDevice = screenWidth <= 480;
export const isMediumDevice = screenWidth > 480 && screenWidth < 768;
export const isLargeDevice = screenWidth >= 768;
export const isTablet = screenWidth >= 768 && screenHeight >= 1024;

// Pixel density
export const pixelDensity = PixelRatio.get();
export const isHighDensity = pixelDensity >= 3;

// Enhanced font scaling with pixel density consideration
export const fontSize = (size) => {
  const scale = screenWidth / 375; // Base on iPhone 6/7/8 width
  const newSize = size * scale;
  
  // Adjust for pixel density
  if (isHighDensity && isSmallDevice) {
    return Math.max(newSize * 0.85, size * 0.8);
  }
  
  if (isPixel2) return Math.max(newSize * 0.78, size * 0.75);
  if (isSmallDevice) return Math.max(newSize * 0.87, size * 0.85);
  if (isTablet) return newSize * 1.2;
  
  return newSize;
};

// Responsive spacing
export const spacing = {
  xs: screenWidth * 0.01,
  sm: screenWidth * 0.02,
  md: screenWidth * 0.04,
  lg: screenWidth * 0.06,
  xl: screenWidth * 0.08,
};

// Responsive dimensions
export const responsiveWidth = (percentage) => {
  return (screenWidth * percentage) / 100;
};

export const responsiveHeight = (percentage) => {
  return (screenHeight * percentage) / 100;
};

// Platform-specific adjustments
export const platformSelect = (ios, android) => {
  return Platform.select({ ios, android });
};

// Safe area calculations
export const getSafeAreaPadding = () => {
  if (Platform.OS === 'ios') {
    // iPhone X and newer have different safe areas
    const isIPhoneX = screenHeight >= 812;
    return {
      top: isIPhoneX ? 44 : 20,
      bottom: isIPhoneX ? 34 : 0,
    };
  }
  
  return {
    top: 24, // Standard Android status bar
    bottom: 0,
  };
};

// Optimized layout calculations
export const getOptimalItemSize = (containerWidth, minItemWidth = 150, spacing = 10) => {
  const availableWidth = containerWidth - (spacing * 2);
  const itemsPerRow = Math.floor(availableWidth / (minItemWidth + spacing));
  const itemWidth = (availableWidth - (spacing * (itemsPerRow - 1))) / itemsPerRow;
  
  return {
    itemWidth,
    itemsPerRow,
  };
};
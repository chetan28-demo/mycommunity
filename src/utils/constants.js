// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.116:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Screen dimensions and responsive breakpoints
export const SCREEN_BREAKPOINTS = {
  SMALL: 480,
  MEDIUM: 768,
  LARGE: 1024,
};

// Performance constants
export const PERFORMANCE_CONFIG = {
  FLATLIST_INITIAL_RENDER: 3,
  FLATLIST_MAX_BATCH: 5,
  FLATLIST_WINDOW_SIZE: 10,
  IMAGE_CACHE_SIZE: 50,
  AUTO_SCROLL_INTERVAL: 8000,
};

// Common styles
export const COMMON_COLORS = {
  PRIMARY: '#212529',
  SECONDARY: '#6c757d',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40',
  WHITE: '#ffffff',
  BLACK: '#000000',
};

export const SHADOW_STYLES = {
  LIGHT: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  HEAVY: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};
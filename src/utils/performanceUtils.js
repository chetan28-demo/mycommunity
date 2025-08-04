import { InteractionManager, Dimensions } from 'react-native';

export const runAfterInteractions = (callback) => {
  return InteractionManager.runAfterInteractions(callback);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const getOptimalImageSize = (originalWidth, originalHeight, maxWidth = null) => {
  const screenWidth = Dimensions.get('window').width;
  const targetWidth = maxWidth || screenWidth;
  
  if (originalWidth <= targetWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const ratio = originalHeight / originalWidth;
  return {
    width: targetWidth,
    height: targetWidth * ratio,
  };
};

export const memoizeWithExpiry = (fn, ttl = 300000) => { // 5 minutes default
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }
    
    const result = fn(...args);
    cache.set(key, { value: result, timestamp: Date.now() });
    
    // Clean up expired entries
    if (cache.size > 100) {
      const now = Date.now();
      for (const [k, v] of cache.entries()) {
        if (now - v.timestamp >= ttl) {
          cache.delete(k);
        }
      }
    }
    
    return result;
  };
};
import { Image } from 'react-native';

class ImageCache {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  preloadImage(uri) {
    if (this.cache.has(uri)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      Image.prefetch(uri)
        .then(() => {
          this.addToCache(uri);
          resolve();
        })
        .catch(reject);
    });
  }

  addToCache(uri) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(uri, Date.now());
  }

  preloadImages(uris) {
    return Promise.all(uris.map(uri => this.preloadImage(uri)));
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}

export default new ImageCache();
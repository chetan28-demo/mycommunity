import React, { useState, useCallback } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import { COMMON_COLORS } from '../../utils/constants';
import imageCache from '../../utils/imageCache';

const OptimizedImage = ({ 
  source, 
  style, 
  resizeMode = 'cover',
  placeholder = true,
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
    if (source?.uri) {
      imageCache.addToCache(source.uri);
    }
  }, [source]);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={error ? { uri: 'https://via.placeholder.com/300x200/cccccc/666666?text=Image+Not+Found' } : source}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />
      
      {loading && placeholder && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={COMMON_COLORS.PRIMARY} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COMMON_COLORS.LIGHT,
  },
});

export default OptimizedImage;
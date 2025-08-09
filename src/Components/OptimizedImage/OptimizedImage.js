import React, { useState, useCallback } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../UI';
import { COLORS, SPACING } from '../../theme';
import imageCache from '../../utils/imageCache';

const OptimizedImage = ({ 
  source, 
  style, 
  resizeMode = 'cover',
  placeholder = true,
  fallbackText = 'Image not available',
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

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Ionicons name="image-outline" size={32} color={COLORS.neutral[400]} />
        <Text variant="caption" color="secondary" style={styles.errorText}>
          {fallbackText}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />
      
      {loading && placeholder && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.primary[600]} />
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
    backgroundColor: COLORS.neutral[50],
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
  },
  errorText: {
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default OptimizedImage;
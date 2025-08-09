import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '../UI';
import { COLORS, SPACING } from '../../theme';

const LoadingSpinner = ({ 
  size = 'large', 
  color = COLORS.primary[600], 
  text = 'Loading...',
  style = {} 
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text variant="body2" color="secondary" style={styles.text}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  text: {
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
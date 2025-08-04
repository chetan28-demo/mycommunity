import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COMMON_COLORS } from '../../utils/constants';

const LoadingSpinner = ({ 
  size = 'large', 
  color = COMMON_COLORS.PRIMARY, 
  text = 'Loading...',
  style = {} 
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: COMMON_COLORS.SECONDARY,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
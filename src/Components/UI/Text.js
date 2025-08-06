import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { TYPOGRAPHY, COLORS } from '../../theme';

const Text = ({ 
  variant = 'body1', 
  color = 'primary', 
  style, 
  children, 
  ...props 
}) => {
  const textStyle = [
    styles.base,
    TYPOGRAPHY[variant],
    { color: getTextColor(color) },
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const getTextColor = (color) => {
  if (typeof color === 'string') {
    // Check if it's a predefined color
    if (COLORS.text[color]) {
      return COLORS.text[color];
    }
    // Check if it's a direct color value
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return color;
    }
    // Default to primary text color
    return COLORS.text.primary;
  }
  return COLORS.text.primary;
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default Text;
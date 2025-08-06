import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, CARD_SHADOWS } from '../../theme';

const Card = ({ 
  children, 
  style, 
  shadow = 'medium',
  padding = 'md',
  ...props 
}) => {
  const cardStyle = [
    styles.base,
    CARD_SHADOWS[shadow],
    { padding: SPACING[padding] },
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});

export default Card;
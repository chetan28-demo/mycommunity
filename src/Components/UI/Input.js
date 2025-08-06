import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';
import Text from './Text';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry,
  style,
  inputStyle,
  multiline = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const containerStyle = [
    styles.container,
    isFocused && styles.focused,
    error && styles.error,
    style,
  ];

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text variant="label" color="secondary" style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={containerStyle}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={COLORS.neutral[400]} 
            style={styles.leftIcon} 
          />
        )}
        
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          multiline={multiline}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isSecure ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.neutral[400]}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <Ionicons 
            name={rightIcon} 
            size={20} 
            color={COLORS.neutral[400]} 
            style={styles.rightIcon} 
          />
        )}
      </View>
      
      {error && (
        <Text variant="caption" color={COLORS.error[600]} style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingHorizontal: SPACING.md,
    minHeight: 48,
  },
  focused: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.white,
  },
  error: {
    borderColor: COLORS.error[600],
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  errorText: {
    marginTop: SPACING.xs,
  },
});

export default Input;
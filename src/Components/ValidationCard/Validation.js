import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '../UI';
import { COLORS, SPACING, SHADOWS } from '../../theme';

const Validation = ({ loading, success }) => {
  return (
    <View style={styles.overlay}>
      <Card style={styles.card} shadow="xl">
        {loading ? (
          <View style={styles.content}>
            <ActivityIndicator size="large" color={COLORS.primary[600]} />
            <Text variant="h6" color="primary" style={styles.title}>
              Processing...
            </Text>
            <Text variant="body2" color="secondary" style={styles.message}>
              Sending your information to the server
            </Text>
          </View>
        ) : (
          success && (
            <View style={styles.content}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={64} color={COLORS.success[500]} />
              </View>
              <Text variant="h5" color="primary" style={styles.title}>
                Success!
              </Text>
              <Text variant="body2" color="secondary" style={styles.message}>
                Your profile has been created successfully
              </Text>
            </View>
          )
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: '80%',
    maxWidth: 300,
    padding: SPACING.xl,
  },
  content: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: SPACING.md,
  },
  title: {
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Validation;
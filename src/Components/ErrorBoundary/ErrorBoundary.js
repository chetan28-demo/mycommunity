import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '../UI';
import { COLORS, SPACING } from '../../theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error[500]} />
          <Text variant="h4" color="primary" style={styles.title}>
            Something went wrong
          </Text>
          <Text variant="body2" color="secondary" style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button onPress={this.handleRetry} style={styles.retryButton}>
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  title: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  message: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  retryButton: {
    marginTop: SPACING.md,
  },
});

export default ErrorBoundary;
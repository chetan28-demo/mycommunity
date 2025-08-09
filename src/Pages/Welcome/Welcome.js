import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '../../Components/UI';
import { COLORS, SPACING, SAFE_AREA } from '../../theme';

const Welcome = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="people-circle" size={80} color={COLORS.primary[600]} />
          <Text variant="h1" color="primary" style={styles.title}>
            Welcome
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            Welcome to our community platform
          </Text>
        </View>

        <Button 
          onPress={() => navigation.navigate("TabNavigator")}
          size="large"
          style={styles.button}
        >
          Go to Homepage
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  title: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});

export default Welcome;
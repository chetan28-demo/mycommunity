import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import MarriageCard from "../MarriageCard/MarriageCard";
import { Text } from '../UI';
import { COLORS, SPACING } from '../../theme';

const MarriageList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await fetch("http://192.168.1.116:8080/api/users/matches");
      if (!response.ok) throw new Error('Failed to fetch matches');
      
      const data = await response.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const renderMatch = useCallback(({ item }) => (
    <MarriageCard match={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text variant="body2" color="secondary" style={styles.loadingText}>
          Loading matches...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error[500]} />
        <Text variant="h6" color="primary" style={styles.errorTitle}>
          Failed to load matches
        </Text>
        <Text variant="body2" color="secondary" style={styles.errorMessage}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={keyExtractor}
        renderItem={renderMatch}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  errorTitle: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
  },
  listContainer: {
    paddingTop: SPACING.lg,
    paddingBottom: 100,
  },
});

export default MarriageList;
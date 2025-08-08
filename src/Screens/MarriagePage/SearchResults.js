import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MarriageCard from '../../Components/MarriageCard/MarriageCard';
import { Text } from '../../Components/UI';
import { COLORS, SPACING, SAFE_AREA, SHADOWS } from '../../theme';

const SearchResults = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { matches = [] } = route.params || {};

  const renderMatch = ({ item }) => <MarriageCard match={item} />;
  const keyExtractor = (item, index) => index.toString();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text variant="h5" color="primary" style={styles.headerTitle}>
          Search Results
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Results */}
      {matches.length === 0 ? (
        <View style={styles.noResults}>
          <Ionicons name="search-outline" size={64} color={COLORS.neutral[400]} />
          <Text variant="h5" color="primary" style={styles.noResultsTitle}>
            No matches found
          </Text>
          <Text variant="body2" color="secondary" style={styles.noResultsText}>
            Try adjusting your search criteria
          </Text>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text variant="h6" color="primary">
              Found {matches.length} match{matches.length !== 1 ? 'es' : ''}
            </Text>
          </View>
          
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SAFE_AREA.top,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    ...SHADOWS.sm,
  },
  backButton: {
    padding: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  noResultsTitle: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  noResultsText: {
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  listContainer: {
    paddingVertical: SPACING.sm,
    paddingBottom: 100,
  },
});

export default SearchResults;
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '../UI';
import { COLORS, SPACING } from '../../theme';

const CategoryItem = React.memo(({ item, isActive, onPress }) => {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        isActive ? styles.activeCard : styles.inactiveCard,
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <Text 
        variant="label" 
        color={isActive ? "inverse" : "primary"} 
        style={styles.categoryText}
      >
        {t(`categories.${item}`, item)}
      </Text>
    </TouchableOpacity>
  );
});

const RectangleCard = ({ activeCategory, setActiveCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = useMemo(() => 'http://192.168.1.116:8080/api/fed-categories/feedcategories', []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        console.error("Invalid format from API:", data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const renderItem = useCallback(({ item }) => (
    <CategoryItem
      item={item}
      isActive={activeCategory === item}
      onPress={setActiveCategory}
    />
  ), [activeCategory, setActiveCategory]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={COLORS.white} />
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContainer}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      windowSize={10}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  flatListContainer: {
    paddingHorizontal: SPACING.sm,
  },
  categoryCard: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    marginHorizontal: SPACING.xs,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  activeCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  inactiveCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default RectangleCard;
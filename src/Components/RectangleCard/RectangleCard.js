import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './RectangleCardStyles';

const RectangleCard = ({ activeCategory, setActiveCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
    <TouchableOpacity
      style={[
        styles.rectangleCard,
        activeCategory === item ? styles.activeCard : styles.inactiveCard,
      ]}
      onPress={() => setActiveCategory(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.cardText}>
        {t(`categories.${item}`, item)}
      </Text>
    </TouchableOpacity>
  ), [activeCategory, setActiveCategory, t]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#725f5fff" />
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

export default RectangleCard;
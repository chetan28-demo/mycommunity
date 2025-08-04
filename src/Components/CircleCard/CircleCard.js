import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './CircleCardStyles';

const CircleCard = ({ activeCategory, setActiveCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const API_URL = useMemo(() => 'http://192.168.1.116:8080/api/fed-categories/feedcategories', []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        console.error('Invalid categories response');
      }
    } catch (err) {
      console.error('Fetch categories failed:', err);
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
        styles.circleCard,
        activeCategory === item ? styles.activeCard : styles.inactiveCard,
      ]}
      onPress={() => setActiveCategory(item)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.cardText,
          activeCategory === item ? styles.activeText : styles.inactiveText,
        ]}
      >
        {t(`categories.${item}`, item)}
      </Text>
    </TouchableOpacity>
  ), [activeCategory, setActiveCategory, t]);

  const keyExtractor = useCallback((item, index) => item + index, []);

  const changeLanguage = useCallback(() => {
    const nextLang = i18n.language === 'en' ? 'gj' : 'en';
    i18n.changeLanguage(nextLang);
  }, [i18n]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
      />

      <TouchableOpacity 
        style={styles.languageBtn} 
        onPress={changeLanguage}
        activeOpacity={0.8}
      >
        <Text style={styles.languageText}>
          {i18n.language === 'en' ? 'Gujarati' : 'English'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CircleCard;
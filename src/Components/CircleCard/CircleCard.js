
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.1.116:8080/api/fed-categories/feedcategories');
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
    };

    fetchCategories();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.circleCard,
        activeCategory === item ? styles.activeCard : styles.inactiveCard,
      ]}
      onPress={() => setActiveCategory(item)}
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
  );

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
        keyExtractor={(item, index) => item + index}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />

      {/* Language Switcher Button */}
      <TouchableOpacity style={styles.languageBtn} onPress={() => {
        const nextLang = i18n.language === 'en' ? 'gj' : 'en';
        i18n.changeLanguage(nextLang);
      }}>
        <Text style={styles.languageText}>
          {i18n.language === 'en' ? 'Gujarati' : 'English'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CircleCard;







import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Text, Card } from './UI';
import { COLORS, SPACING } from '../theme';

const CategoryItem = React.memo(({ category }) => (
  <Card style={styles.card}>
    {category.img && (
      <Image source={{ uri: category.img }} style={styles.cardImage} />
    )}
    <View style={styles.cardDetails}>
      <Text variant="h6" color="primary" style={styles.cardTitle}>
        {category.name}
      </Text>
      {category.email && (
        <Text variant="body2" color="secondary" style={styles.cardEmail}>
          {category.email}
        </Text>
      )}
    </View>
  </Card>
));

const DetailCard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.1.116:3000/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderCategory = ({ item }) => <CategoryItem category={item} />;
  const keyExtractor = (item) => item.id.toString();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text variant="body2" color="secondary" style={styles.loadingText}>
          Loading categories...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.sm,
  },
  listContainer: {
    padding: SPACING.md,
  },
  card: {
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardDetails: {
    padding: SPACING.md,
  },
  cardTitle: {
    marginBottom: SPACING.xs,
  },
  cardEmail: {
    // No additional styles needed
  },
});

export default DetailCard;
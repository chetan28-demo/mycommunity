import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import TopBar from '../../Components/TopBar/TopBar';
import PostCard from '../../Components/PostCard/PostCard';
import Banner from '../../Components/Banner/Banner';
import { COLORS, SPACING } from '../../theme';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('Home');
  const [refreshing, setRefreshing] = useState(false);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh - you can add actual refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <TopBar 
        activeCategory={activeCategory} 
        setActiveCategory={handleCategoryChange}
      />
      
      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary[600]]}
            tintColor={COLORS.primary[600]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Banner />
        <PostCard activeCategory={activeCategory} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContainer: {
    flex: 1,
  },
});

export default Home;
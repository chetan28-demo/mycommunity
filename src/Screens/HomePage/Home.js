import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from '../../Components/TopBar/TopBar';
import PostCard from '../../Components/PostCard/PostCard';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('Home');

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  return (
    <View style={styles.container}>
      <TopBar 
        activeCategory={activeCategory} 
        setActiveCategory={handleCategoryChange}
      />
      
      <View style={styles.contentContainer}>
        <PostCard activeCategory={activeCategory} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  contentContainer: {
    flex: 1,
  },
});

export default Home;
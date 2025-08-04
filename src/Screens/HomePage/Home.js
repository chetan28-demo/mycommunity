
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CircleCard from '../../Components/CircleCard/CircleCard'; // Adjust this import based on your folder structure
import PostCard from '../../Components/PostCard/PostCard';    // Adjust this import based on your folder structure
import TabNavigator from '../../Components/TabNavigator';
import TopBar from '../../Components/TopBar/TopBar';
import ReactangleCard from '../../Components/RectangleCard/RectangleCard';
import Banner from '../../Components/Banner/Banner';


const Home = () => {
  const [activeCategory, setActiveCategory] = useState('Home'); // Default category is "Home"

  return (
    <>
   
  <TopBar activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
  

    <View style={styles.container}>
      {/* <View style={styles.circleCardContainer}>
        <CircleCard activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </View> */}
      {/* <View >
        <ReactangleCard activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </View> */}
    
      {/* <ScrollView contentContainerStyle={styles.scrollView}> // virtualized erorr showing so commenting these part  */}
      {/* <Banner/> */}
   <View style={{ flex: 1 }}>
  <PostCard activeCategory={activeCategory} />
</View>

      {/* </ScrollView> */}
   
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  circleCardContainer: {
    marginTop: 40,  // Gap of 30 from the top
  },

  scrollView: {
    paddingHorizontal: 10, // To ensure spacing around post cards
    paddingBottom: 100,  // Add space at the bottom for better UI
  },
  divider: {
    borderBottomWidth: 1,   // Thin divider line
    borderBottomColor: '#ddd', // Light grey color for divider
    marginHorizontal: 16,  // Ensuring margin on both sides
    marginVertical: 16,   // Space between CircleCard and PostCard
  },
});

export default Home;

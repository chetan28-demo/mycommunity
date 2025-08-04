
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RectangleCard from '../RectangleCard/RectangleCard';
import { useNavigation } from "@react-navigation/native";
import styles from './TopBarStyles';

const TopBar = ({ profileImage, onMessagePress, activeCategory, setActiveCategory }) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      {/* Profile + Icons Row */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress}>
          <Image
            source={{ uri: profileImage || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="notifications-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onMessagePress} style={styles.iconContainer}>
            <Ionicons name="chatbubble-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* RectangleCard below TopRow */}
      <RectangleCard 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
    </View>
  );
};

export default TopBar;

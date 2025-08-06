import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import RectangleCard from '../RectangleCard/RectangleCard';
import { Text } from '../UI';
import { COLORS, SPACING, SHADOWS, SAFE_AREA } from '../../theme';

const TopBar = ({ profileImage, onMessagePress, activeCategory, setActiveCategory }) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  return (
    <LinearGradient
      colors={[COLORS.primary[600], COLORS.primary[700]]}
      style={styles.container}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress}>
          <Image
            source={{ 
              uri: profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' 
            }}
            style={styles.profileImage}
          />
          <View style={styles.statusIndicator} />
        </TouchableOpacity>

        <View style={styles.centerContent}>
          <Text variant="h5" color="inverse" style={styles.appTitle}>
            Community
          </Text>
          <Text variant="caption" color="inverse" style={styles.subtitle}>
            Stay connected
          </Text>
        </View>

        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
            <View style={styles.notificationBadge}>
              <Text variant="caption" color="inverse" style={styles.badgeText}>
                3
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onMessagePress} style={styles.iconButton}>
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Selector */}
      <View style={styles.categoryContainer}>
        <RectangleCard 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SAFE_AREA.top,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success[500],
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
  },
  appTitle: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
    padding: SPACING.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: SPACING.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.error[500],
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginTop: SPACING.sm,
  },
});

export default TopBar;
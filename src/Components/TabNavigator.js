import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import HomeScreen from '../Screens/HomePage/Home';
import ProfileScreen from '../Screens/ProfilePage/Profile';
import Explore from '../Screens/ExplorePage/Explore';
import Marriage from '../Screens/MarriagePage/Marriage';
import { useTranslation } from 'react-i18next';
import { Text } from './UI';
import { COLORS, SPACING, SHADOWS } from '../theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, size, color, focused, type = 'Ionicons' }) => {
  const IconComponent = type === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
                       type === 'Feather' ? Feather : Ionicons;
  
  return (
    <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
      <IconComponent 
        name={name} 
        size={focused ? size + 2 : size} 
        color={color} 
      />
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
};

const TabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary[600],
        tabBarInactiveTintColor: COLORS.neutral[500],
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={100} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.white }]} />
          )
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("tabs.Home"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
              focused={focused}
              type="MaterialCommunityIcons"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          title: t("tabs.Explore"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="plus-circle"
              size={24}
              color={color}
              focused={focused}
              type="Feather"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Marriage"
        component={Marriage}
        options={{
          title: t("tabs.Marriage"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "people" : "people-outline"}
              size={24}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t("tabs.Profile"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    borderTopWidth: 0,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : COLORS.white,
    ...SHADOWS.lg,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  focusedIconContainer: {
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary[600],
  },
});

export default TabNavigator;
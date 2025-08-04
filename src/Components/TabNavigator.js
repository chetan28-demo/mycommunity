
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from '@expo/vector-icons';
import HomeScreen from '../Screens/HomePage/Home';
import ProfileScreen from '../Screens/ProfilePage/Profile';
import Explore from '../Screens/ExplorePage/Explore';
import Marriage from '../Screens/MarriagePage/Marriage';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#242526',
        tabBarInactiveTintColor: '#999',
        tabBarHideOnKeyboard: true, // ✅ Hide tab bar when keyboard opens
        tabBarStyle: {
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10,
          height: 65,
          paddingBottom: 8,
          paddingTop: 5,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("tabs.Home"),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={focused ? 28 : 24}
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
            <Feather
              name="plus-square"
              color={color}
              size={focused ? 26 : 22}
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
            <View
              style={{
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(36, 37, 38, 0.08)' : 'transparent',
                padding: 4,
              }}
            >
              <Ionicons
                name={focused ? "people" : "people-outline"}
                color={color}
                size={focused ? 28 : 24}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t("tabs.Profile"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={focused ? 26 : 22}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

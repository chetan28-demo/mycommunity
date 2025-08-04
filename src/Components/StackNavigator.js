

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "../Pages/Welcome/Welcome";
import FirstPage from "../Pages/FirstPage/FirstPage";
import SecondPage from "../Pages/SecondPage/SecondPage";
import Auth from "../Pages/Auth/Auth";
import Home from "../Screens/HomePage/Home";
import Forms from "../Pages/Forms/Forms";
import UserProfile from "../Pages/UsersProfilePage/UserProfile";
import CommentPage from "../Pages/CommentPage/CommentPage";
import TabNavigator from "./TabNavigator";
import SearchResults from "../Screens/MarriagePage/SearchResults";
import FamilyTreePopup from "./FamilyTree/FamilyTreePopup";

const Stack = createNativeStackNavigator(); // ✅ FIXED here

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FirstPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="SecondPage" component={SecondPage} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Forms" component={Forms} />
        <Stack.Screen name="userprofile" component={UserProfile} />
        <Stack.Screen name="SearchResults" component={SearchResults} />
        <Stack.Screen name="FamilyTree" component={FamilyTreePopup} />

        
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="commentpage" component={CommentPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

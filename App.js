import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import StackNavigator from './src/Components/StackNavigator';
import { MemberStatusProvider } from './src/context/MemberStatusContext';
import { AuthProvider } from './src/context/AuthContext';
import ErrorBoundary from './src/Components/ErrorBoundary/ErrorBoundary';

const Stack = createStackNavigator();

function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <MemberStatusProvider>
            <StackNavigator />
            <StatusBar style="auto" />
          </MemberStatusProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default App;
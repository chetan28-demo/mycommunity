import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackNavigator from './src/Components/StackNavigator';
import { MemberStatusProvider } from './src/context/MemberStatusContext';
import { AuthProvider } from './src/context/AuthContext';
import ErrorBoundary from './src/Components/ErrorBoundary/ErrorBoundary';

export default function App() {
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
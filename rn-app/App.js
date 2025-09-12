import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <AppNavigator />
            <StatusBar style="dark" />
          </SafeAreaView>
        </NavigationContainer>
      </AuthProvider>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
});

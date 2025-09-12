import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TestsScreen from '../screens/TestsScreen';
import PerformanceScreen from '../screens/PerformanceScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TestInstructionScreen from '../screens/TestInstructionScreen';
import TestRecordScreen from '../screens/TestRecordScreen';
import TestSubmissionScreen from '../screens/TestSubmissionScreen';
import { createStackNavigator } from '@react-navigation/stack';

const TestsStack = createStackNavigator();

function TestsStackScreen() {
  return (
    <TestsStack.Navigator>
      <TestsStack.Screen name="TestsList" component={TestsScreen} options={{ title: 'Tests' }} />
      <TestsStack.Screen name="TestInstruction" component={TestInstructionScreen} options={{ title: 'Instructions' }} />
      <TestsStack.Screen name="TestRecord" component={TestRecordScreen} options={{ title: 'Record Test' }} />
      <TestsStack.Screen name="TestSubmission" component={TestSubmissionScreen} options={{ title: 'Review Results' }} />
    </TestsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tests" component={TestsStackScreen} />
      <Tab.Screen name="Performance" component={PerformanceScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

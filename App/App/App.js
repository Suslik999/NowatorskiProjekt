import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import ChatScreen from './Screens/ChatScreen.js';
import FoodSearchScreen from './Screens/FoodSearchScreen.js';

const Tab = createBottomTabNavigator();

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text>Profile</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screen}>
    <Text>Settings</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBarOptions={{
          activeTintColor: '#d4145a',
          inactiveTintColor: 'gray', 
        }}
      >
        <Tab.Screen
          name="Chatbot"
          component={ChatScreen}
          options={{
            tabBarIcon: () => <Text style={styles.tabIcon}>💬</Text>,
          }}
        />
        <Tab.Screen
          name="Food Search"
          component={FoodSearchScreen}
          options={{
            tabBarIcon: () => <Text style={styles.tabIcon}>🍽️</Text>,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: () => <Text style={styles.tabIcon}>👤</Text>,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: () => <Text style={styles.tabIcon}>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
  },
});

// app/(tabs)/_layout.js
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'black',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="Cadastro" // This points to the 'app/(tabs)/Cadastro' directory
        options={{
          title: 'Cadastro',
          headerShown: false, // Hides the header for the tab itself
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="plus" size={24} color={focused ? color : 'gray'} />
          ),
        }}
      />

      <Tabs.Screen
        name="HomeScreen" // This points to the 'app/(tabs)/HomeScreen.js' file
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="home" size={24} color={focused ? color : 'gray'} />
          ),
        }}
      />

      <Tabs.Screen
        name="Listagem" // This points to the 'app/(tabs)/Listagem.js' file
        options={{
          title: 'Listagem',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="bars" size={24} color={focused ? color : 'gray'} />
          ),
        }}
      />
    </Tabs>
  );
}
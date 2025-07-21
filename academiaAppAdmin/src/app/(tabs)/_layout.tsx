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
        name="Cadastro"
        options={{
          title: 'Cadastro',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="plus" size={24} color={focused ? color : 'gray'} />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            navigation.navigate('Cadastro');
          },
        })}
      />


      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Início',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="home" size={24} color={focused ? color : 'gray'} />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            navigation.navigate('HomeScreen');
          },
        })}
      />

      <Tabs.Screen
        name="Listagem"
        options={{
          title: 'Listagem',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="bars" size={24} color={focused ? color : 'gray'} />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            navigation.navigate('Listagem');
          },
        })}
      />
    </Tabs>
  );
}
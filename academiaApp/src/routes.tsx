import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './pages/HomeScreen';
import Sobre from './pages/Sobre';

const Tab = createBottomTabNavigator();

// MyTabBar.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#222', paddingVertical: 10 }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // ícones simples para cada aba
        const iconName = route.name === 'Home' ? 'home' : 'person';

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={iconName} size={24} color={isFocused ? '#fff' : '#888'} />
            <Text style={{ color: isFocused ? '#fff' : '#888', fontSize: 12 }}>
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Routes(){
    return(
        <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
            <Tab.Screen name='Home' component={HomeScreen}/>
            <Tab.Screen name='Sobre' component={Sobre}/>
        </Tab.Navigator>
    )
}
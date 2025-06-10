import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function TabLayout() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#90ee90' : 'green',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#888',
        tabBarStyle: {
          backgroundColor: isDark ? '#222' : '#fff',
          borderTopColor: isDark ? '#333' : '#eee',
        },
        headerStyle: {
          backgroundColor: isDark ? '#222' : '#fff',
        },
        headerTitleStyle: {
          color: isDark ? '#fff' : '#222',
        },
        headerTintColor: isDark ? '#fff' : '#222',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Treino"
        options={{
          title: 'Treino',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="wheelchair-alt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}

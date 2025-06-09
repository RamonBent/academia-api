import { View, Text } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function PerfilScreen() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#222' : '#F3F6FA',
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#fff' : '#222' }}>
        Perfil
      </Text>
      <Text style={{ color: isDark ? '#ccc' : '#444' }}>Bem-vindo ao seu perfil!</Text>
    </View>
  );
}
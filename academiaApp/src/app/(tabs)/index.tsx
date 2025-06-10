import { View, Text } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function PerfilScreen() {
  const { theme } = useContext(ThemeContext);
  const { userEmail } = useAuth();
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
      <Text style={{ fontSize: 18, marginTop: 20, color: isDark ? '#fff' : '#222' }}>
        Bem-vindo, {userEmail}!
      </Text>
    </View>
  );
}
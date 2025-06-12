import { ThemeContext } from 'context/ThemeContext';
import { useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function Tab() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#222' : '#fff' }]}>
      <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 18, marginBottom: 16 }}>
        Tema atual: {theme === 'dark' ? 'Escuro' : 'Claro'}
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? '#fff' : '#222'}
        trackColor={{ false: '#ccc', true: '#444' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
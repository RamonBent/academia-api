import React, { useState } from 'react';
import { 
  Text, 
  TextInput, 
  StyleSheet, 
  View, 
  Image,
  useWindowDimensions 
} from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('Kaik-Aciole@01');
  const [password, setPassword] = useState('**********');
  const { height } = useWindowDimensions();

  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.title}>LOGIN</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>EMAIL OU USUÁRIO:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>SENHA:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.footer}>
        <Image
          source={require('../assets/headphones.png')} // ou qualquer ícone semelhante
          style={styles.icon}
        />
        <Text style={styles.welcomeText}>BEM VINDO AO NOSSO APP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 50,
    color: '#000000',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  input: {
    height: 45,
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000000',
  },
  footer: {
    alignItems: 'center',
    marginTop: 60,
  },
  icon: {
    width: 35,
    height: 35,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
});

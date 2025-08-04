import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Listagem() {
  const router = useRouter();

  const registrationOptions = [
    { title: "👥 Alunos", route: '/Listagem/ListarAlunos' },
    { title: "📏 Avaliações Físicas", route: '/Listagem/ListarAvaliacaoFisica' },
    { title: "🏋️ Exercícios", route: '/Listagem/ListarExercicios' },
    { title: "🧑‍🏫 Instrutores", route: '/Listagem/ListarInstrutores' },
    { title: "📑 Treinos", route: '/Listagem/ListarTreinos' }
  ];

  return (
    <LinearGradient
      colors={['#2A324B', '#767B91']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Listagem</Text>
        <Text style={styles.subtitle}>Selecione o que deseja visualizar</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {registrationOptions.map((button, index) => (
          <CustomButton
            key={index}
            title={button.title}
            onPress={() => router.push(button.route as any)}
            containerStyle={styles.button}
            textStyle={styles.buttonText}
          />
        ))}
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F0F0F0',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#C5D8D1',
    opacity: 0.8,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 24,
    width: '100%',
  },
  button: {
    marginVertical: 8,
    width: '100%',
  },
  buttonText: {
    color: '#000'
  },
});
import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function CadastroScreen() {
  const router = useRouter();

  const registrationOptions = [
    { title: "👤 Cadastrar Aluno", route: '/Cadastro/AlunoForm' },
    { title: "📏 Cadastrar Avaliação Física", route: '/Cadastro/AvaliacaoFisicaForm' },
    { title: "🏋️ Cadastrar Exercício", route: '/Cadastro/ExercicioForm' },
    { title: "🧑‍🏫 Cadastrar Instrutor", route: '/Cadastro/InstrutorForm' },
    { title: "📝 Cadastrar Treino", route: '/Cadastro/TreinoForm' }
  ];

  return (
    <LinearGradient
      colors={['#2A324B', '#767B91']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cadastros</Text>
        <Text style={styles.subtitle}>Selecione o tipo de registro</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {registrationOptions.map((option, index) => (
          <CustomButton
            key={index}
            title={option.title}
            onPress={() => router.push(option.route as any)}
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
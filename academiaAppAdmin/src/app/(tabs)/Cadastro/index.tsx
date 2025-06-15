import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { useRouter } from 'expo-router';

export default function CadastroScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>
      <CustomButton
        title="Cadastrar Aluno"
        onPress={() => router.push('/Cadastro/AlunoForm')}
      />
      <CustomButton
        title="Cadastrar Avaliacao Física"
        onPress={() => router.push('/Cadastro/AvaliacaoFisicaForm')}
      />
      <CustomButton
        title="Cadastrar Exercício"
        onPress={() => router.push('/Cadastro/ExercicioForm')}
      />
      <CustomButton
        title="Cadastrar Instrutor"
        onPress={() => router.push('/Cadastro/InstrutorForm')}
      />
      <CustomButton
        title="Cadastrar Treino"
        onPress={() => router.push('/Cadastro/TreinoForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
});
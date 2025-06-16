import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { useRouter } from 'expo-router';

export default function Listagem() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listar</Text>
      <CustomButton
        title="Listar Alunos"
        onPress={() => router.push('/Listagem/ListarAlunos')}
      />
      <CustomButton
        title="Listar Avaliações Física"
        onPress={() => router.push('/Listagem/ListarAvaliacaoFisica')}
      />
      <CustomButton
        title="Listar Exercicios"
        onPress={() => router.push('/Cadastro/ExercicioForm')}
      />
      <CustomButton
        title="Listar Instrutores"
        onPress={() => router.push('/Cadastro/InstrutorForm')}
      />
      <CustomButton
        title="Listar Treinos"
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
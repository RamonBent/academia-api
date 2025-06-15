import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXERCICIO_STORAGE_KEY = '@myApp:exercicios';

export default function ExercicioForm() {
  const router = useRouter();
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [grupoMuscular, setGrupoMuscular] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    const loadExercicios = async () => {
      try {
        const storedExercicios = await AsyncStorage.getItem(EXERCICIO_STORAGE_KEY);
        if (storedExercicios !== null) {
          let exercicios = JSON.parse(storedExercicios);
          console.log("Loaded exercícios:", exercicios);
        }
      } catch (error) {
        console.error("Error loading exercícios from AsyncStorage", error);
      }
    };

    loadExercicios();
  }, []);

  const handleSubmit = async () => {
    if (nomeExercicio && grupoMuscular && descricao) {
      const newExercicio = {
        id: Date.now().toString(),
        nomeExercicio,
        grupoMuscular,
        descricao,
      };

      try {
        const existingExerciciosJson = await AsyncStorage.getItem(EXERCICIO_STORAGE_KEY);
        let exercicios = existingExerciciosJson ? JSON.parse(existingExerciciosJson) : [];

        exercicios.push(newExercicio);

        await AsyncStorage.setItem(EXERCICIO_STORAGE_KEY, JSON.stringify(exercicios));

        Alert.alert('Exercício cadastrado com sucesso!', `Dados do Exercício\nNome: ${nomeExercicio}\nGrupo Muscular: ${grupoMuscular}\nDescrição: ${descricao}`);

        setNomeExercicio('');
        setGrupoMuscular('');
        setDescricao('');
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o exercício. Por favor, tente novamente.');
        console.error("Error saving exercício to AsyncStorage", error);
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Formulário de Cadastro de Exercício</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Exercício:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Supino Reto"
          value={nomeExercicio}
          onChangeText={setNomeExercicio}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Grupo Muscular:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Peito, Tríceps"
          value={grupoMuscular}
          onChangeText={setGrupoMuscular}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição/Instruções:</Text>
        <TextInput
          style={styles.input}
          placeholder="Detalhes sobre a execução do exercício"
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Salvar Exercício</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar para Cadastro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
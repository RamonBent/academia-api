import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXERCICIO_STORAGE_KEY = '@myApp:exercicios';

export default function ExercicioForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [grupoMuscular, setGrupoMuscular] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const loadExercicio = async () => {
      if (id) {
        try {
          const stored = await AsyncStorage.getItem(EXERCICIO_STORAGE_KEY);
          if (stored) {
            const exercicios = JSON.parse(stored);
            const exercicio = exercicios.find((a) => a.id === id);
            if (exercicio) {
              setNomeExercicio(exercicio.nomeExercicio);
              setGrupoMuscular(exercicio.grupoMuscular);
              setDescricao(exercicio.descricao);
              setIsEdit(true);
            }
          }
        } catch (error) {
          Alert.alert('Erro', 'Erro ao carregar exercício para edição.');
        }
      }
    };
    loadExercicio();
  }, [id]);

  const handleSubmit = async () => {
    if (nomeExercicio && grupoMuscular && descricao) {
      try {
        const stored = await AsyncStorage.getItem(EXERCICIO_STORAGE_KEY);
        let exercicios = stored ? JSON.parse(stored) : [];
        if (isEdit) {
          exercicios = exercicios.map((a) =>
            a.id === id
              ? { ...a, nomeExercicio, grupoMuscular, descricao }
              : a
          );
        } else {
          exercicios.push({
            id: Date.now().toString(),
            nomeExercicio,
            grupoMuscular,
            descricao,
          });
        }
        await AsyncStorage.setItem(EXERCICIO_STORAGE_KEY, JSON.stringify(exercicios));
        router.back();
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar exercício.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Editar Exercício' : 'Formulário de Cadastro de Exercício'}
      </Text>

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
        <Text style={styles.submitButtonText}>
          {isEdit ? 'Salvar Alterações' : 'Salvar Exercício'}
        </Text>
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
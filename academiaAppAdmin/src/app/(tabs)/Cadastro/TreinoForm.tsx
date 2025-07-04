import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TREINO_STORAGE_KEY = '@myApp:treinos';

export default function TreinoForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [alunoId, setAlunoId] = useState('');
  const [instrutorId, setInstrutorId] = useState('');
  const [nomeTreino, setNomeTreino] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const loadTreino = async () => {
      if (id) {
        try {
          const stored = await AsyncStorage.getItem(TREINO_STORAGE_KEY);
          if (stored) {
            const treinos = JSON.parse(stored);
            const treino = treinos.find((a) => a.id === id);
            if (treino) {
              setAlunoId(treino.alunoId);
              setInstrutorId(treino.instrutorId);
              setNomeTreino(treino.nomeTreino);
              setDataInicio(treino.dataInicio);
              setDataFim(treino.dataFim);
              setObjetivo(treino.objetivo);
              setIsEdit(true);
            }
          }
        } catch (error) {
          Alert.alert('Erro', 'Erro ao carregar treino para edição.');
        }
      }
    };
    loadTreino();
  }, [id]);

  const handleSubmit = async () => {
    if (alunoId && instrutorId && nomeTreino && dataInicio && dataFim && objetivo) {
      try {
        const stored = await AsyncStorage.getItem(TREINO_STORAGE_KEY);
        let treinos = stored ? JSON.parse(stored) : [];
        if (isEdit) {
          treinos = treinos.map((a) =>
            a.id === id
              ? { ...a, alunoId, instrutorId, nomeTreino, dataInicio, dataFim, objetivo }
              : a
          );
        } else {
          treinos.push({
            id: Date.now().toString(),
            alunoId,
            instrutorId,
            nomeTreino,
            dataInicio,
            dataFim,
            objetivo,
          });
        }
        await AsyncStorage.setItem(TREINO_STORAGE_KEY, JSON.stringify(treinos));
        router.back();
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar treino.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Editar Treino' : 'Formulário de Cadastro de Treino'}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ID do Aluno:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o ID do aluno"
          value={alunoId}
          onChangeText={setAlunoId}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ID do Instrutor:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o ID do instrutor"
          value={instrutorId}
          onChangeText={setInstrutorId}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Treino:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Treino A - Força"
          value={nomeTreino}
          onChangeText={setNomeTreino}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data de Início (DD/MM/AAAA):</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 01/01/2023"
          keyboardType="numbers-and-punctuation"
          value={dataInicio}
          onChangeText={setDataInicio}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data de Fim (DD/MM/AAAA):</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 31/01/2023"
          keyboardType="numbers-and-punctuation"
          value={dataFim}
          onChangeText={setDataFim}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Objetivo do Treino:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Ganho de massa, Emagrecimento"
          value={objetivo}
          onChangeText={setObjetivo}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEdit ? 'Salvar Alterações' : 'Salvar Treino'}
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
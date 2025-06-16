import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const EXERCICIO_STORAGE_KEY = '@myApp:exercicios';

export default function ListarExercicios() {
  const [exercicios, setExercicios] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadExercicios = async () => {
      try {
        const storedExercicios = await AsyncStorage.getItem(EXERCICIO_STORAGE_KEY);
        if (storedExercicios !== null) {
          setExercicios(JSON.parse(storedExercicios));
        }
      } catch (error) {
        console.error("Error loading exercícios from AsyncStorage", error);
      }
    };

    loadExercicios();
  }, []);

  const handleDelete = async (id) => {
    const filtered = exercicios.filter((exercicio) => exercicio.id !== id);
    setExercicios(filtered);
    await AsyncStorage.setItem(EXERCICIO_STORAGE_KEY, JSON.stringify(filtered));
  };

  const handleEdit = (id) => {
    router.push({ pathname: '/Cadastro/ExercicioForm', params: { id } });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lista de Exercícios</Text>
      {exercicios.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum exercício cadastrado.</Text>
      ) : (
        exercicios.map((exercicio, index) => (
          <View key={exercicio.id || index} style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.name}>{exercicio.nomeExercicio || 'Nome não informado'}</Text>
              <Text>Grupo Muscular: {exercicio.grupoMuscular}</Text>
              <Text>Descrição: {exercicio.descricao}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(exercicio.id)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(exercicio.id)}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar para Listagem</Text>
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 25,
    alignSelf: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
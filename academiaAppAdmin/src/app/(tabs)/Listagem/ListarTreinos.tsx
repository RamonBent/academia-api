import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import Constants from 'expo-constants';

export const API_BASE_URL = Constants?.manifest?.extra?.API_BASE_URL;

export default function ListarTreinos() {
  const [treinos, setTreinos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadTreinos = async () => {
      try {
        const storedTreinos = await AsyncStorage.getItem(`${API_BASE_URL}/api/treinos`);
        if (storedTreinos !== null) {
          setTreinos(JSON.parse(storedTreinos));
        }
      } catch (error) {
        console.error("Error loading treinos from AsyncStorage", error);
      }
    };

    loadTreinos();
  }, []);

  const handleDelete = async (id) => {
    const filtered = treinos.filter((treino) => treino.id !== id);
    setTreinos(filtered);
    await AsyncStorage.setItem(`${API_BASE_URL}/api/treinos`, JSON.stringify(filtered));
  };

  const handleEdit = (id) => {
    router.push({ pathname: '/Cadastro/TreinoForm', params: { id } });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lista de Treinos</Text>
      {treinos.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum treino cadastrado.</Text>
      ) : (
        treinos.map((treino, index) => (
          <View key={treino.id || index} style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.name}>{treino.nomeTreino || 'Nome não informado'}</Text>
              <Text>ID do Aluno: {treino.alunoId}</Text>
              <Text>ID do Instrutor: {treino.instrutorId}</Text>
              <Text>Início: {treino.dataInicio}</Text>
              <Text>Fim: {treino.dataFim}</Text>
              <Text>Objetivo: {treino.objetivo}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(treino.id)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(treino.id)}
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
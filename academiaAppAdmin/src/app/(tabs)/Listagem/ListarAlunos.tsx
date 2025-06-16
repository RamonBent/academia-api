import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const STUDENTS_STORAGE_KEY = '@myApp:students';

export default function ListarAlunos() {
  const [alunos, setAlunos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadAlunos = async () => {
      try {
        const storedAlunos = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
        if (storedAlunos !== null) {
          setAlunos(JSON.parse(storedAlunos));
        }
      } catch (error) {
        console.error("Error loading alunos from AsyncStorage", error);
      }
    };

    loadAlunos();
  }, []);

  const handleDelete = async (id) => {
    const filtered = alunos.filter((aluno) => aluno.id !== id);
    setAlunos(filtered);
    await AsyncStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(filtered));
  };

  const handleEdit = (id) => {
    router.push({ pathname: '/Cadastro/AlunoForm', params: { id } });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lista de Alunos</Text>
      {alunos.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum aluno cadastrado.</Text>
      ) : (
        alunos.map((aluno, index) => (
          <View key={aluno.id || index} style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.name}>{aluno.nome || 'Nome não informado'}</Text>
              <Text>Idade: {aluno.idade}</Text>
              <Text>Email: {aluno.email}</Text>
              <Text>Telefone: {aluno.telefone}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(aluno.id)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(aluno.id)}
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
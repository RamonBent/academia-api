import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const STUDENTS_STORAGE_KEY = '@myApp:students';

export default function ListarAlunos() {
  const [students, setStudents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const storedStudents = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
        if (storedStudents !== null) {
          setStudents(JSON.parse(storedStudents));
        }
      } catch (error) {
        console.error("Error loading students from AsyncStorage", error);
      }
    };

    loadStudents();
  }, []);

  const handleDelete = async (id) => {
    const filtered = students.filter((student) => student.id !== id);
    setStudents(filtered);
    await AsyncStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(filtered));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lista de alunos cadastrados</Text>
      {students.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum aluno cadastrado.</Text>
      ) : (
        students.map((student, index) => (
          <View key={student.id || index} style={styles.studentCardRow}>
            <View style={styles.studentCard}>
              <Text style={styles.studentName}>{student.nome || 'Nome não informado'}</Text>
              <Text>Idade: {student.idade}</Text>
              <Text>Email: {student.email}</Text>
              <Text>Telefone: {student.telefone}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {/* Ação de Editar */}}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(student.id)}
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
  studentCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  studentCard: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  studentName: {
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
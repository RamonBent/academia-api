import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ListarExercicios() {
  const [exercicios, setExercicios] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchExercicios = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/exercicios`);
        setExercicios(response.data);
      } catch (error) {
        console.error("Erro ao buscar exercícios da API", error);
      }
    };

    fetchExercicios();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/exercicios/${id}`);
      setExercicios((prev) => prev.filter((exercicio) => exercicio.id !== id));
    } catch (error) {
      console.error("Erro ao deletar exercício", error);
    }
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
          <View key={exercicio.id || index} style={styles.card}>
            <Text style={styles.cardTitle}>{exercicio.nome || 'Nome não informado'}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Grupo:</Text>
              <Text style={styles.value}>{exercicio.grupoMuscular}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Séries:</Text>
              <Text style={styles.value}>{exercicio.series}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Repetições:</Text>
              <Text style={styles.value}>{exercicio.repeticoes}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Carga:</Text>
              <Text style={styles.value}>{exercicio.carga} kg</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Descanso:</Text>
              <Text style={styles.value}>{exercicio.descansoSegundos} seg</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Treino ID:</Text>
              <Text style={styles.value}>{exercicio.treinoId}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(exercicio.id)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(exercicio.id)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  label: {
    width: 100,
    fontWeight: '600',
    color: '#34495e',
  },
  value: {
    flex: 1,
    color: '#2c3e50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  editButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#3498db', 
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

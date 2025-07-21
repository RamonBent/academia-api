import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ListarTreinos() {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  const loadTreinos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/treinos`);
      const data = await response.json();
      setTreinos(data);
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os treinos');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTreinos();
    }, [])
  );


  const handleDelete = async (id) => {
    Alert.alert('Confirmação', 'Deseja realmente excluir este treino?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(id);
          try {
            await fetch(`${API_BASE_URL}/api/treinos/${id}`, {
              method: 'DELETE',
            });
            await loadTreinos();
          } catch (error) {
            console.error('Erro ao excluir treino:', error);
            Alert.alert('Erro', 'Não foi possível excluir o treino');
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  const handleEdit = (id) => {
    router.push({ pathname: '/Cadastro/TreinoForm', params: { id } });
  };

  if (loading && treinos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando treinos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Lista de Treinos</Text>

      {treinos.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum treino cadastrado.</Text>
      ) : (
        treinos.map((treino) => (
          <View key={treino.id} style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{treino.nome}</Text>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Objetivo:</Text>
                <Text>{treino.objetivo}</Text>
              </View>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Nível:</Text>
                <Text>{treino.nivel}</Text>
              </View>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Alunos:</Text>
                <Text>
                  {treino.alunosIds && treino.alunosIds.length > 0 
                    ? treino.alunosIds.join(', ') 
                    : 'Nenhum aluno vinculado'}
                </Text>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => handleEdit(treino.id)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.deleteButton, 
                       deletingId === treino.id && styles.disabledButton]}
                onPress={() => handleDelete(treino.id)}
                disabled={deletingId === treino.id}
              >
                {deletingId === treino.id ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Excluir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/Listagem')}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2c3e50',
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cardLabel: {
    fontWeight: '600',
    width: 100,
    color: '#34495e',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#27ae60',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#7f8c8d',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
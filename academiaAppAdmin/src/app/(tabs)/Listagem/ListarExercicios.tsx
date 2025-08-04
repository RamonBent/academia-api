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
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';
import { syncOfflineData } from '../../../services/syncService'; // Assuming this path is correct

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ListarExercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isOnline, setIsOnline] = useState(true); // State to track network status
  const router = useRouter();

  // Effect to listen for network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  // Function to fetch exercises from API
  const fetchExercicios = async () => {
    setLoading(true);
    // Only attempt to fetch if online
    if (!isOnline) {
      setLoading(false);
      // In a real offline scenario, you'd load from a local database here
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/exercicios`);
      setExercicios(response.data);
    } catch (error) {
      console.error("Erro ao buscar exercícios da API:", error);
      Alert.alert('Erro', 'Não foi possível carregar os exercícios. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega dinamicamente ao focar na tela e sincroniza dados offline
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true); // Start loading when screen is focused
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          // If online, try to sync offline data first
          syncOfflineData().then(() => {
            fetchExercicios(); // Then fetch fresh data
          }).catch(syncError => {
            console.error('Erro durante a sincronização:', syncError);
            Alert.alert('Erro de Sincronização', 'Falha ao sincronizar dados offline. Tentando carregar dados existentes.');
            fetchExercicios(); // Still try to load data even if sync fails
          });
        } else {
          // If offline, just load available data (will fail if no local cache is implemented for fetching)
          Alert.alert('Modo Offline', 'Você está offline. Os dados podem não estar atualizados e algumas ações estão desabilitadas.');
          fetchExercicios(); // Try to fetch, knowing it might fail
        }
      });
    }, [])
  );

  const handleDelete = async (id) => {
    // Prevent deletion if offline
    if (!isOnline) {
      Alert.alert('Aviso', 'Você está offline. Exclusões só podem ser feitas online.');
      return;
    }

    Alert.alert('Confirmação', 'Deseja realmente excluir este exercício?', [
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
            await axios.delete(`${API_BASE_URL}/api/exercicios/${id}`);
            setExercicios((prev) => prev.filter((exercicio) => exercicio.id !== id));
            Alert.alert("Sucesso", "Exercício excluído com sucesso!");
          } catch (error) {
            console.error("Erro ao deletar exercício:", error);
            Alert.alert("Erro", "Não foi possível excluir o exercício. Tente novamente.");
            fetchExercicios(); // Reload data in case of error
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  const handleEdit = (id) => {
    // Prevent editing if offline
    if (!isOnline) {
      Alert.alert('Aviso', 'Você está offline. Edições só podem ser feitas online.');
      return;
    }
    router.push({ pathname: '/Cadastro/ExercicioForm', params: { id } });
  };

  if (loading && exercicios.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando exercícios...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Lista de Exercícios</Text>

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Você está offline. Os dados podem não estar atualizados e algumas ações estão desabilitadas.</Text>
        </View>
      )}

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
              <TouchableOpacity
                style={[styles.editButton, !isOnline && styles.disabledButton]}
                onPress={() => handleEdit(exercicio.id)}
                disabled={!isOnline}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, deletingId === exercicio.id && styles.disabledButton]}
                onPress={() => handleDelete(exercicio.id)}
                disabled={deletingId === exercicio.id || !isOnline}
              >
                {deletingId === exercicio.id ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Excluir</Text>
                )}
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
  contentContainer: {
    paddingBottom: 40, // Add padding to the bottom for better scrolling
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
    fontSize: 16,
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
  offlineBanner: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  offlineText: {
    color: '#856404',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#95a5a6', // Gray out disabled buttons
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator // Import ActivityIndicator for loading state
} from 'react-native';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo
import { syncOfflineData } from '../../../services/syncService'; // Import syncOfflineData
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ListarAvaliacaoFisica() {
  const [avaliacoesFisica, setAvaliacoesFisica] = useState([]);
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

  // Function to fetch physical evaluations from API
  const fetchAvaliacoes = async () => {
    setLoading(true);
    // Only attempt to fetch if online
    if (!isOnline) {
      setLoading(false);
      // In a real offline scenario, you'd load from a local database here
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/avaliacoes`);
      setAvaliacoesFisica(response.data);
    } catch (error) {
      console.error("Erro ao buscar avaliações físicas da API:", error);
      Alert.alert("Erro", "Não foi possível carregar as avaliações físicas. Verifique sua conexão.");
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
            fetchAvaliacoes(); // Then fetch fresh data
          }).catch(syncError => {
            console.error('Erro durante a sincronização:', syncError);
            Alert.alert('Erro de Sincronização', 'Falha ao sincronizar dados offline. Tentando carregar dados existentes.');
            fetchAvaliacoes(); // Still try to load data even if sync fails
          });
        } else {
          // If offline, just load available data (will fail if no local cache is implemented for fetching)
          Alert.alert('Modo Offline', 'Você está offline. Os dados podem não estar atualizados e algumas ações estão desabilitadas.');
          fetchAvaliacoes(); // Try to fetch, knowing it might fail
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

    Alert.alert('Confirmação', 'Deseja realmente excluir esta avaliação?', [
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
            await axios.delete(`${API_BASE_URL}/api/avaliacoes/${id}`);
            
            // Optimistically update the UI
            setAvaliacoesFisica(prevAvaliacoes => prevAvaliacoes.filter(avaliacao => avaliacao.id !== id));
            
            Alert.alert("Sucesso", "Avaliação excluída com sucesso!");
            
          } catch (error) {
            console.error("Erro ao excluir avaliação:", error);
            Alert.alert("Erro", "Não foi possível excluir a avaliação. Tente novamente.");
            fetchAvaliacoes(); // Reload data in case of error
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
    router.push({ pathname: '/Cadastro/AvaliacaoFisicaForm', params: { id } });
  };

  const formatAltura = (altura) => {
    if (!altura) return 'N/A';
    return altura < 10 ? `${altura * 100} cm` : `${altura} m`;
  };

  const formatIMC = (imc) => {
    if (!imc) return 'N/A';
    if (imc < 10 || imc > 100) return 'Inválido';
    return imc.toFixed(2);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString || 'N/A';
    }
  };

  if (loading && avaliacoesFisica.length === 0) {
    return (
      <View>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando avaliações...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Lista de Avaliações Físicas</Text>
      
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Você está offline. Os dados podem não estar atualizados e algumas ações estão desabilitadas.</Text>
        </View>
      )}

      {avaliacoesFisica.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma avaliação física cadastrada.</Text>
      ) : (
        avaliacoesFisica.map((avaliacao) => (
          <View key={avaliacao.id} style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                Aluno: {avaliacao.nomeAluno || 'Nome não disponível'}
              </Text>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Data:</Text>
                <Text>{formatDate(avaliacao.dataAvaliacao)}</Text>
              </View>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Peso:</Text>
                <Text>{avaliacao.peso ? `${avaliacao.peso} kg` : 'N/A'}</Text>
              </View>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Altura:</Text>
                <Text>{formatAltura(avaliacao.altura)}</Text>
              </View>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>IMC:</Text>
                <Text style={avaliacao.imc < 10 || avaliacao.imc > 100 ? styles.invalidValue : null}>
                  {formatIMC(avaliacao.imc)}
                </Text>
              </View>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Observações:</Text>
                <Text style={styles.observacoesText}>
                  {avaliacao.observacoes || 'Nenhuma observação'}
                </Text>
              </View>
            </View>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton, !isOnline && styles.disabledButton]}
                onPress={() => handleEdit(avaliacao.id)}
                disabled={!isOnline}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.deleteButton, deletingId === avaliacao.id && styles.disabledButton]}
                onPress={() => handleDelete(avaliacao.id)}
                disabled={deletingId === avaliacao.id || !isOnline}
              >
                {deletingId === avaliacao.id ? (
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
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
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
  contentContainer: {
    paddingBottom: 40, // Add padding to the bottom for better scrolling
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c3e50',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#7f8c8d',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#7f8c8d',
    fontSize: 16,
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
    fontWeight: 'bold',
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
  observacoesText: {
    flex: 1,
    flexWrap: 'wrap',
  },
  invalidValue: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#27ae60',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    color: 'white',
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

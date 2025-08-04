import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  TextInput, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import { useRouter, useFocusEffect } from 'expo-router';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';
import { syncOfflineData } from '../../../services/syncService';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ListarInstrutores() {
  const [instrutores, setInstrutores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  const fetchInstrutores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/instrutores`);
      setInstrutores(response.data);
    } catch (error) {
      console.error("Erro ao carregar instrutores:", error);
      if (isOnline) {
        Alert.alert("Erro", "Não foi possível carregar a lista de instrutores");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchInstrutores();
    }, [])
  );

  const handleRefresh = () => {
    if (!isOnline) {
      Alert.alert('Aviso', 'Você está offline. Não é possível atualizar os dados.');
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    fetchInstrutores();
  };

  const deleteInstrutor = async (id: number) => {
    if (!isOnline) {
      Alert.alert('Aviso', 'Você está offline. Exclusões só podem ser feitas online.');
      return;
    }

    Alert.alert('Confirmação', 'Deseja realmente excluir este instrutor?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/api/instrutores/${id}`);
            setInstrutores(prev => prev.filter(instrutor => instrutor.id !== id));
            Alert.alert("Sucesso", "Instrutor excluído com sucesso!");
          } catch (error) {
            console.error("Erro ao excluir instrutor:", error);
            Alert.alert("Erro", "Não foi possível excluir o instrutor");
          }
        },
      },
    ]);
  };

  const filteredInstrutores = instrutores.filter(instrutor =>
    instrutor.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando instrutores...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#3498db']}
          tintColor="#3498db"
        />
      }
    >
      <Text style={styles.title}>Lista de Instrutores</Text>

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Modo offline - Algumas funcionalidades estão desativadas</Text>
        </View>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar instrutor..."
        placeholderTextColor="#999"
        value={filtro}
        onChangeText={setFiltro}
      />

      {filteredInstrutores.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>
            {filtro ? 'Nenhum instrutor encontrado' : 'Nenhum instrutor cadastrado'}
          </Text>
        </View>
      ) : (
        filteredInstrutores.map(instrutor => (
          <View key={instrutor.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{instrutor.nome}</Text>
              <Text style={styles.cardSubtitle}>CREF: {instrutor.numeroCreef || 'Não informado'}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardText}>
                <Text style={styles.cardLabel}>Email: </Text>
                {instrutor.email || 'Não informado'}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.cardLabel}>Telefone: </Text>
                {instrutor.telefone || 'Não informado'}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={[styles.button, styles.editButton, !isOnline && styles.disabledButton]}
                onPress={() => router.push(`/Cadastro/InstrutorForm?id=${instrutor.id}`)}
                disabled={!isOnline}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton, !isOnline && styles.disabledButton]}
                onPress={() => deleteInstrutor(instrutor.id)}
                disabled={!isOnline}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/Cadastro/InstrutorForm')}
      >
        <Text style={styles.addButtonText}>+ Adicionar Instrutor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  cardBody: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#34495e',
  },
  cardLabel: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  offlineBanner: {
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  offlineText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});
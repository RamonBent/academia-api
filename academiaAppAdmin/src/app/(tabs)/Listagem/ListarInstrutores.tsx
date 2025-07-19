import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

import Constants from 'expo-constants';

export const API_BASE_URL = Constants?.manifest?.extra?.API_BASE_URL;

export default function ListarInstrutores() {
  const [instrutores, setInstrutores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [instrutoresFiltrados, setInstrutoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchInstrutores();
  }, []);

  useEffect(() => {
    if (filtro.trim() === '') {
      setInstrutoresFiltrados(instrutores);
    } else {
      const filtroMinusculo = filtro.toLowerCase();
      setInstrutoresFiltrados(
        instrutores.filter(instrutor => 
          instrutor.nome && instrutor.nome.toLowerCase().includes(filtroMinusculo)
        )
      );
    }
  }, [filtro, instrutores]);

  const fetchInstrutores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/instrutores`);
      setInstrutores(response.data);
      setInstrutoresFiltrados(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lista de instrutores.");
      console.error("Erro ao carregar instrutores:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteInstrutor = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/api/instrutores/${id}`);
      
      // Atualização otimista - remove o instrutor da lista antes de recarregar
      setInstrutores(prevInstrutores => prevInstrutores.filter(instrutor => instrutor.id !== id));
      
      Alert.alert("Sucesso", "Instrutor excluído com sucesso!");
      
    } catch (error) {
      console.error("Erro ao excluir instrutor:", error);
      Alert.alert("Erro", "Não foi possível excluir o instrutor.");
      // Recarrega a lista em caso de erro para garantir consistência
      fetchInstrutores();
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (id) => {
    setEditingId(id);
    try {
      router.push({ 
        pathname: '/Cadastro/InstrutorForm', 
        params: { id: id.toString() }
      });
    } catch (error) {
      console.error("Erro ao navegar para edição:", error);
      Alert.alert("Erro", "Não foi possível abrir a edição");
    } finally {
      setEditingId(null);
    }
  };

  if (loading && instrutores.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando instrutores...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lista de Instrutores</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar instrutor pelo nome"
        value={filtro}
        onChangeText={setFiltro}
        autoCapitalize="none"
      />

      {instrutoresFiltrados.length === 0 ? (
        <Text style={styles.emptyText}>
          {filtro ? 'Nenhum instrutor encontrado com este nome.' : 'Nenhum instrutor cadastrado.'}
        </Text>
      ) : (
        instrutoresFiltrados.map((instrutor) => (
          <View key={instrutor.id} style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.name}>{instrutor.nome || 'Nome não informado'}</Text>
              <Text>CREF: {instrutor.cref || '-'}</Text>
              <Text>Especialidade: {instrutor.especialidade || '-'}</Text>
              <Text>Telefone: {instrutor.telefone || '-'}</Text>
              <Text>Email: {instrutor.email || '-'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.editButton, editingId === instrutor.id && styles.disabledButton]}
              onPress={() => handleEdit(instrutor.id)}
              disabled={editingId === instrutor.id}
            >
              {editingId === instrutor.id ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.editButtonText}>Editar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteButton, deletingId === instrutor.id && styles.disabledButton]}
              onPress={() => deleteInstrutor(instrutor.id)}
              disabled={deletingId === instrutor.id}
            >
              {deletingId === instrutor.id ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.deleteButtonText}>Excluir</Text>
              )}
            </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
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
  disabledButton: {
    backgroundColor: '#a0a0a0',
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
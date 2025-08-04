import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ListarInstrutores() {
  const [instrutores, setInstrutores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [instrutoresFiltrados, setInstrutoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  const { useFocusEffect } = require('expo-router');
  useFocusEffect(
    React.useCallback(() => {
      fetchInstrutores();
    }, [])
  );

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

      // Atualiza localmente para resposta instantânea
      setInstrutores(prev => prev.filter(instrutor => instrutor.id !== id));
      setInstrutoresFiltrados(prev => prev.filter(instrutor => instrutor.id !== id));

      Alert.alert("Sucesso", "Instrutor excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir instrutor:", error);
      Alert.alert("Erro", "Não foi possível excluir o instrutor.");
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
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando instrutores...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Lista de Instrutores</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar instrutor pelo nome"
        placeholderTextColor="#95a5a6"
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
          <View key={instrutor.id} style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{instrutor.nome || 'Nome não informado'}</Text>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>CREF:</Text>
                <Text>{instrutor.cref || '-'}</Text>
              </View>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Especialidade:</Text>
                <Text>{instrutor.especialidade || '-'}</Text>
              </View>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Telefone:</Text>
                <Text>{instrutor.telefone || '-'}</Text>
              </View>
              
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Email:</Text>
                <Text>{instrutor.email || '-'}</Text>
              </View>
            </View>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton, editingId === instrutor.id && styles.disabledButton]}
                onPress={() => handleEdit(instrutor.id)}
                disabled={editingId === instrutor.id}
              >
                {editingId === instrutor.id ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Editar</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.deleteButton, deletingId === instrutor.id && styles.disabledButton]}
                onPress={() => deleteInstrutor(instrutor.id)}
                disabled={deletingId === instrutor.id}
              >
                {deletingId === instrutor.id ? (
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
  searchInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e6ed',
    color: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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

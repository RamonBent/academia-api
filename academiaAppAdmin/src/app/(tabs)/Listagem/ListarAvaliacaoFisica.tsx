import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ListarAvaliacaoFisica() {
  const [avaliacoesFisica, setAvaliacoesFisica] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  const { useFocusEffect } = require('expo-router');
  useFocusEffect(
    React.useCallback(() => {
      fetchAvaliacoes();
    }, [])
  );

  const fetchAvaliacoes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/avaliacoes`);
      setAvaliacoesFisica(response.data);
    } catch (error) {
      console.error("Erro ao buscar avaliações físicas da API", error);
      Alert.alert("Erro", "Não foi possível carregar as avaliações físicas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/avaliacoes/${id}`);

      // Remove da lista local para update imediato
      setAvaliacoesFisica(prev => prev.filter(av => av.id !== id));

      Alert.alert("Sucesso", "Avaliação excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      Alert.alert("Erro", "Não foi possível excluir a avaliação. Recarregando lista...");
      fetchAvaliacoes(); // Recarrega para manter sincronização
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    try {
      router.push({ pathname: '/Cadastro/AvaliacaoFisicaForm', params: { id: id.toString() } });
    } catch (error) {
      console.error("Erro ao navegar para edição:", error);
      Alert.alert("Erro", "Não foi possível abrir a edição");
    } finally {
      setEditingId(null);
    }
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando avaliações físicas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lista de Avaliações Físicas</Text>
      
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
                style={[styles.button, styles.editButton, editingId === avaliacao.id && styles.disabledButton]}
                onPress={() => handleEdit(avaliacao.id)}
                disabled={editingId === avaliacao.id}
              >
                {editingId === avaliacao.id ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Editar</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.deleteButton, deletingId === avaliacao.id && styles.disabledButton]}
                onPress={() => handleDelete(avaliacao.id)}
                disabled={deletingId === avaliacao.id}
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
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c3e50',
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
    justifyContent: 'center',
    height: 40,
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
  disabledButton: {
    backgroundColor: '#95a5a6',
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
});

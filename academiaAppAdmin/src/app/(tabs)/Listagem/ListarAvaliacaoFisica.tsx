import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AVALIACAO_STORAGE_KEY = '@myApp:avaliacoesFisicas';

export default function ListarAvaliacaoFisica() {
  const [avaliacoesFisica, setavaliacoesFisica] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadAvaliacoesFisica = async () => {
      try {
        const storedAvaliacoesFisica = await AsyncStorage.getItem(AVALIACAO_STORAGE_KEY);
        if (storedAvaliacoesFisica !== null) {
          setavaliacoesFisica(JSON.parse(storedAvaliacoesFisica));
        }
      } catch (error) {
        console.error("Error loading avaliações físicas from AsyncStorage", error);
      }
    };

    loadAvaliacoesFisica();
  }, []);

  const handleDelete = async (id) => {
    const filtered = avaliacoesFisica.filter((avaliacao) => avaliacao.id !== id);
    setavaliacoesFisica(filtered);
    await AsyncStorage.setItem(AVALIACAO_STORAGE_KEY, JSON.stringify(filtered));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lista de avaliações físicas</Text>
      {avaliacoesFisica.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma avaliação física cadastrada.</Text>
      ) : (
        avaliacoesFisica.map((avaliacao, index) => (
          <View key={avaliacao.id || index} style={styles.avaliacoesFisicaCardRow}>
            <View style={styles.avaliacoesFisicaCard}>
              <Text style={styles.avaliacoesFisicaName}>Aluno ID: {avaliacao.alunoId || 'Não informado'}</Text>
              <Text>Data: {avaliacao.dataAvaliacao}</Text>
              <Text>Peso: {avaliacao.peso} kg</Text>
              <Text>Altura: {avaliacao.altura} m</Text>
              <Text>IMC: {avaliacao.imc}</Text>
              <Text>% Gordura: {avaliacao.percentualGordura}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {/* Ação de Editar */}}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(avaliacao.id)}
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
  avaliacoesFisicaCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avaliacoesFisicaCard: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  avaliacoesFisicaName: {
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
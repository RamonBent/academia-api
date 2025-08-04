import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function TreinoForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [nivel, setNivel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);  // para controlar loading

  useEffect(() => {
    const loadTreino = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/treinos/${id}`);
          const treino = response.data;
          setNome(treino.nome || '');
          setObjetivo(treino.objetivo || '');
          setNivel(treino.nivel || '');
          setIsEdit(true);
        } catch (error) {
          Alert.alert('Erro', 'Erro ao carregar treino para edição.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadTreino();
  }, [id]);

  const handleSubmit = async () => {
    if (!nome || !objetivo || !nivel) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const treinoRequest = { nome, objetivo, nivel };

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/treinos/${id}`, treinoRequest);
        Alert.alert('Sucesso', 'Treino atualizado com sucesso.');
        router.replace('/(tabs)/Listagem/ListarTreinos');
      } else {
        await axios.post(`${API_BASE_URL}/treinos`, treinoRequest);
        Alert.alert('Sucesso', 'Treino cadastrado com sucesso.');
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar treino. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{isEdit ? 'Editar Treino' : 'Cadastrar Novo Treino'}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Treino</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Treino A - Força"
          value={nome}
          onChangeText={setNome}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Objetivo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Hipertrofia, Emagrecimento"
          value={objetivo}
          onChangeText={setObjetivo}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nível</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Iniciante, Intermediário, Avançado"
          value={nivel}
          onChangeText={setNivel}
          editable={!loading}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityLabel={isEdit ? 'Salvar alterações do treino' : 'Cadastrar novo treino'}
      >
        <Text style={styles.submitButtonText}>
          {isEdit ? 'Salvar Alterações' : 'Cadastrar Treino'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.backButton, loading && { opacity: 0.6 }]}
        onPress={() => router.back()}
        disabled={loading}
        accessibilityLabel="Voltar à tela anterior"
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

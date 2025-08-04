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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';
import { saveOfflineData, syncOfflineData } from '../../../services/syncService';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function TreinoForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [nivel, setNivel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      
      if (state.isConnected) {
        syncOfflineData();
      }
    });

    if (id) {
      loadTreinoData();
    }

    return () => unsubscribe();
  }, [id]);

  const loadTreinoData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/treinos/${id}`);
      const treino = response.data;
      setNome(treino.nome || '');
      setObjetivo(treino.objetivo || '');
      setNivel(treino.nivel || '');
      setIsEdit(true);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar treino para edição.');
    }
  };

  const handleSubmit = async () => {
    if (!nome || !objetivo || !nivel) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const treinoRequest = {
      nome,
      objetivo,
      nivel,
    };

    try {
      if (isEdit) {
        await handleEdit(treinoRequest);
      } else {
        await handleCreate(treinoRequest);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o treino.');
    }
  };

  const handleEdit = async (treinoRequest: any) => {
    if (!isOnline) {
      Alert.alert('Aviso', 'Você está offline. Edições só podem ser feitas online.');
      return;
    }

    await axios.put(`${API_BASE_URL}/api/treinos/${id}`, treinoRequest);
    Alert.alert('Sucesso', 'Treino atualizado com sucesso.');
    router.replace('/(tabs)/Listagem/ListarTreinos');
  };

  const handleCreate = async (treinoRequest: any) => {
    if (isOnline) {
      try {
        await axios.post(`${API_BASE_URL}/api/treinos`, treinoRequest);
        Alert.alert('Sucesso', 'Treino cadastrado com sucesso.');
        router.back();
      } catch (error) {
        await saveOfflineAndAlert(treinoRequest);
      }
    } else {
      await saveOfflineAndAlert(treinoRequest);
    }
  };

  const saveOfflineAndAlert = async (treinoRequest: any) => {
    const success = await saveOfflineData(treinoRequest, 'treinos');
    if (success) {
      Alert.alert(
        'Offline Mode',
        'Treino salvo localmente. Será sincronizado quando você estiver online.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('Erro', 'Falha ao salvar o treino localmente.');
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        {isEdit ? 'Editar Treino' : 'Cadastrar Novo Treino'}
      </Text>

      {!isOnline && !isEdit && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Você está offline. Os dados serão sincronizados quando a conexão for restaurada.</Text>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Treino</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Treino A - Força"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Objetivo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Hipertrofia, Emagrecimento"
          value={objetivo}
          onChangeText={setObjetivo}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nível</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Iniciante, Intermediário, Avançado"
          value={nivel}
          onChangeText={setNivel}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEdit ? 'Salvar Alterações' : 'Cadastrar Treino'}
        </Text>
      </TouchableOpacity>

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
});
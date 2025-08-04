import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';
import { saveOfflineData } from '../../../services/syncService';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function AvaliacaoFisicaForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isEdit, setIsEdit] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [avaliacao, setAvaliacao] = useState({
    dataAvaliacao: '',
    peso: '',
    altura: '',
    imc: '',
    observacoes: '',
    alunoId: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Detect network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  // Carrega dados para edição
  useEffect(() => {
    if (id) {
      loadAvaliacaoData();
    }
  }, [id]);

  const loadAvaliacaoData = async () => {
    if (!isOnline) {
      Alert.alert('Aviso', 'Você está offline. Não é possível carregar dados para edição.');
      router.back();
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/avaliacoes/${id}`);
      const data = response.data;
      setAvaliacao({
        dataAvaliacao: data.dataAvaliacao ? data.dataAvaliacao.split('-').reverse().join('/') : '',
        peso: data.peso?.toString() || '',
        altura: data.altura?.toString() || '',
        imc: data.imc?.toString() || '',
        observacoes: data.observacoes || '',
        alunoId: data.alunoId?.toString() || '',
      });
      setSearchTerm(data.alunoNome || '');
      setIsEdit(true);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar avaliação para edição.');
    }
  };

  const buscarAlunos = async (nome: string) => {
    if (!isOnline) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alunos/buscar?nome=${nome}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    let updated = { ...avaliacao, [field]: value };

    if (field === 'peso' || field === 'altura') {
      const peso = parseFloat(field === 'peso' ? value : updated.peso);
      const altura = parseFloat(field === 'altura' ? value : updated.altura);

      if (peso > 0 && altura > 0) {
        updated.imc = (peso / (altura * altura)).toFixed(2);
      } else {
        updated.imc = '';
      }
    }

    setAvaliacao(updated);
  };

  const handleSearchTextChange = (text: string) => {
    setSearchTerm(text);
    setShowSuggestions(true);
    if (text.length > 1) buscarAlunos(text);
    else setSuggestions([]);
  };

  const handleSelectAluno = (aluno: any) => {
    setSearchTerm(aluno.nome);
    setAvaliacao(prev => ({ ...prev, alunoId: aluno.id.toString() }));
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    const { alunoId, peso, altura, imc, dataAvaliacao } = avaliacao;

    if (!alunoId || !dataAvaliacao) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios: Aluno e Data da Avaliação.');
      return;
    }

    // Convertendo a data de DD/MM/AAAA para AAAA-MM-DD
    const dateParts = dataAvaliacao.split('/');
    if (dateParts.length !== 3) {
      Alert.alert('Erro', 'Formato de data inválido. Use DD/MM/AAAA.');
      return;
    }
    const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;

    const avaliacaoRequest = {
      dataAvaliacao: formattedDate,
      peso: peso ? parseFloat(peso) : null,
      altura: altura ? parseFloat(altura) : null,
      imc: imc ? parseFloat(imc) : null,
      observacoes: avaliacao.observacoes,
      alunoId: parseInt(alunoId),
    };

    if (isEdit) {
      await handleEdit(avaliacaoRequest);
    } else {
      await handleCreate(avaliacaoRequest);
    }
  };

  const handleEdit = async (avaliacaoRequest: any) => {
    if (!isOnline) {
      Alert.alert('Aviso', 'Você está offline. Edições só podem ser feitas online.');
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/api/avaliacoes/${id}`, avaliacaoRequest);
      Alert.alert('Sucesso', 'Avaliação atualizada com sucesso!');
      router.replace('/(tabs)/Listagem/ListarAvaliacaoFisica');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar avaliação.');
    }
  };

  const handleCreate = async (avaliacaoRequest: any) => {
    if (isOnline) {
      try {
        await axios.post(`${API_BASE_URL}/api/avaliacoes`, avaliacaoRequest);
        Alert.alert('Sucesso', 'Avaliação cadastrada com sucesso!');
        router.back();
      } catch (error) {
        console.error(error);
        await saveOfflineAndAlert(avaliacaoRequest);
      }
    } else {
      await saveOfflineAndAlert(avaliacaoRequest);
    }
  };

  const saveOfflineAndAlert = async (avaliacaoRequest: any) => {
    const success = await saveOfflineData(avaliacaoRequest, 'avaliacoes');
    if (success) {
      Alert.alert(
        'Modo Offline',
        'Avaliação salva localmente. Os dados serão sincronizados quando a conexão for restaurada.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('Erro', 'Falha ao salvar a avaliação localmente.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowSuggestions(false)}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          {isEdit ? 'Editar Avaliação Física' : 'Cadastrar Nova Avaliação Física'}
        </Text>

        {!isOnline && !isEdit && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>Você está offline. Os dados serão sincronizados quando a conexão for restaurada.</Text>
          </View>
        )}

        {/* Campo de busca */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Buscar Aluno *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do aluno"
            value={searchTerm}
            onChangeText={handleSearchTextChange}
            editable={!isEdit && isOnline}
          />
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps="always"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectAluno(item)}
                  >
                    <Text style={styles.suggestionText}>{item.nome} (ID: {item.id})</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Campo data com conversão */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data da Avaliação *</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            value={avaliacao.dataAvaliacao}
            onChangeText={(text) => handleChange('dataAvaliacao', text)}
          />
        </View>

        {/* Peso */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={avaliacao.peso}
            onChangeText={(text) => handleChange('peso', text)}
          />
        </View>

        {/* Altura */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={avaliacao.altura}
            onChangeText={(text) => handleChange('altura', text)}
          />
        </View>

        {/* IMC calculado automaticamente */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>IMC</Text>
          <Text style={styles.imcText}>
            {avaliacao.imc ? `${avaliacao.imc} (calculado)` : 'Preencha peso e altura'}
          </Text>
        </View>

        {/* Observações */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={avaliacao.observacoes}
            onChangeText={(text) => handleChange('observacoes', text)}
          />
        </View>

        {/* Botões */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isEdit ? 'Salvar Alterações' : 'Cadastrar Avaliação'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
    zIndex: 2,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 8,
  },
  suggestionsContainer: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
  imcText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#ccc',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#333',
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
});
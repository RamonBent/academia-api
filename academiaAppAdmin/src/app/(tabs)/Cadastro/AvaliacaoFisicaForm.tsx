import React, { useEffect, useState, useCallback } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
export default function AvaliacaoFisicaForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isEdit, setIsEdit] = useState(false);
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

  const STORAGE_KEYS = {
    avaliacao: `avaliacao_${id}`,
    suggestionsPrefix: 'alunos_suggestions_',
  };

  const safeParseFloat = (str: string) => {
    if (!str) return 0;
    return parseFloat(str.replace(',', '.'));
  };

  useEffect(() => {
    if (!id) return;

    const loadAvaliacao = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/avaliacoes/${id}`);
        const data = response.data;
        const aval = {
          dataAvaliacao: data.dataAvaliacao ? data.dataAvaliacao.split('-').reverse().join('/') : '',
          peso: data.peso?.toString() || '',
          altura: data.altura?.toString() || '',
          imc: data.imc?.toString() || '',
          observacoes: data.observacoes || '',
          alunoId: data.alunoId?.toString() || '',
        };
        setAvaliacao(aval);
        setSearchTerm(data.alunoNome || '');
        setIsEdit(true);
        await AsyncStorage.setItem(STORAGE_KEYS.avaliacao, JSON.stringify(aval));
      } catch (error) {
        // fallback cache
        const cache = await AsyncStorage.getItem(STORAGE_KEYS.avaliacao);
        if (cache) {
          const aval = JSON.parse(cache);
          setAvaliacao(aval);
          setSearchTerm(aval.alunoNome || ''); // alunoNome pode não estar, ajuste se precisar
          setIsEdit(true);
          Alert.alert('Aviso', 'Dados carregados do cache local devido a falha na rede.');
        } else {
          Alert.alert('Erro', 'Erro ao carregar avaliação para edição e nenhum cache disponível.');
        }
      }
    };

    loadAvaliacao();
  }, [id]);

  const buscarAlunos = async (nome: string) => {
    if (!nome) {
      setSuggestions([]);
      return;
    }
    const cacheKey = STORAGE_KEYS.suggestionsPrefix + nome.toLowerCase();

    try {
      const response = await axios.get(`${API_BASE_URL}/api/alunos/buscar?nome=${nome}`);
      setSuggestions(response.data);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
    } catch (error) {
      const cache = await AsyncStorage.getItem(cacheKey);
      if (cache) {
        setSuggestions(JSON.parse(cache));
        Alert.alert('Aviso', 'Sugestões carregadas do cache local devido a falha na rede.');
      } else {
        setSuggestions([]);
        console.error('Erro ao buscar alunos e não há cache disponível', error);
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    let updated = { ...avaliacao, [field]: value };

    if (field === 'peso' || field === 'altura') {
      const peso = field === 'peso' ? safeParseFloat(value) : safeParseFloat(updated.peso);
      const altura = field === 'altura' ? safeParseFloat(value) : safeParseFloat(updated.altura);

      if (peso > 0 && altura > 0) {
        updated.imc = (peso / (altura * altura)).toFixed(2);
      } else {
        updated.imc = '';
      }
    }

    if (field === 'dataAvaliacao') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const [dia, mes, ano] = parts;
        updated.dataAvaliacao = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      } else {
        updated.dataAvaliacao = value;
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

    if (!alunoId) {
      Alert.alert('Erro', 'Selecione um aluno');
      return;
    }
    if (!dataAvaliacao) {
      Alert.alert('Erro', 'Informe a data da avaliação');
      return;
    }

    try {
      const avaliacaoRequest = {
        ...avaliacao,
        peso: safeParseFloat(peso),
        altura: safeParseFloat(altura),
        imc: parseFloat(imc),
        alunoId: parseInt(alunoId),
        dataAvaliacao: dataAvaliacao.includes('/') 
          ? dataAvaliacao.split('/').reverse().join('-')
          : dataAvaliacao,
      };
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/avaliacoes/${id}`, avaliacaoRequest);
        Alert.alert('Sucesso', 'Avaliação atualizada com sucesso!');
        await AsyncStorage.setItem(STORAGE_KEYS.avaliacao, JSON.stringify(avaliacaoRequest));
        router.replace('/(tabs)/Listagem/ListarAvaliacaoFisica');
      } else {
        await axios.post(`${API_BASE_URL}/avaliacoes`, avaliacaoRequest);
        Alert.alert('Sucesso', 'Avaliação cadastrada com sucesso!');
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar avaliação');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowSuggestions(false)}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cadastro de Avaliação Física</Text>

        {}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Buscar Aluno *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do aluno"
            value={searchTerm}
            onChangeText={handleSearchTextChange}
            autoCorrect={false}
            autoCapitalize="words"
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

        {}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data da Avaliação *</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            value={avaliacao.dataAvaliacao.includes('-') 
              ? avaliacao.dataAvaliacao.split('-').reverse().join('/')
              : avaliacao.dataAvaliacao
            }
            onChangeText={(text) => handleChange('dataAvaliacao', text)}
          />
        </View>

        {}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={avaliacao.peso}
            onChangeText={(text) => handleChange('peso', text)}
          />
        </View>

        {}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={avaliacao.altura}
            onChangeText={(text) => handleChange('altura', text)}
          />
        </View>

        {}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>IMC</Text>
          <Text style={styles.imcText}>
            {avaliacao.imc ? `${avaliacao.imc} (calculado)` : 'Preencha peso e altura'}
          </Text>
        </View>

        {}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={avaliacao.observacoes}
            onChangeText={(text) => handleChange('observacoes', text)}
          />
        </View>

        {}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar Avaliação</Text>
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
});

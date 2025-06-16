import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVALIACAO_STORAGE_KEY = '@myApp:avaliacoesFisicas';

export default function AvaliacaoFisicaForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [alunoId, setAlunoId] = useState('');
  const [dataAvaliacao, setDataAvaliacao] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState('');
  const [percentualGordura, setPercentualGordura] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const loadAvaliacao = async () => {
      if (id) {
        try {
          const stored = await AsyncStorage.getItem(AVALIACAO_STORAGE_KEY);
          if (stored) {
            const avaliacoes = JSON.parse(stored);
            const avaliacao = avaliacoes.find((a) => a.id === id);
            if (avaliacao) {
              setAlunoId(avaliacao.alunoId);
              setDataAvaliacao(avaliacao.dataAvaliacao);
              setPeso(avaliacao.peso.toString());
              setAltura(avaliacao.altura.toString());
              setImc(avaliacao.imc.toString());
              setPercentualGordura(avaliacao.percentualGordura.toString());
              setIsEdit(true);
            }
          }
        } catch (error) {
          Alert.alert('Erro', 'Erro ao carregar avaliação para edição.');
        }
      }
    };
    loadAvaliacao();
  }, [id]);

  const handleSubmit = async () => {
    if (alunoId && dataAvaliacao && peso && altura && imc && percentualGordura) {
      try {
        const stored = await AsyncStorage.getItem(AVALIACAO_STORAGE_KEY);
        let avaliacoes = stored ? JSON.parse(stored) : [];
        if (isEdit) {
          // Edit mode: update existing
          avaliacoes = avaliacoes.map((a) =>
            a.id === id
              ? {
                  ...a,
                  alunoId,
                  dataAvaliacao,
                  peso: parseFloat(peso),
                  altura: parseFloat(altura),
                  imc: parseFloat(imc),
                  percentualGordura: parseFloat(percentualGordura),
                }
              : a
          );
        } else {
          // Create mode: add new
          avaliacoes.push({
            id: Date.now().toString(),
            alunoId,
            dataAvaliacao,
            peso: parseFloat(peso),
            altura: parseFloat(altura),
            imc: parseFloat(imc),
            percentualGordura: parseFloat(percentualGordura),
          });
        }
        await AsyncStorage.setItem(AVALIACAO_STORAGE_KEY, JSON.stringify(avaliacoes));
        router.back();
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar avaliação física.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Editar Avaliação Física' : 'Formulário de Cadastro de Avaliação Física'}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ID do Aluno:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o ID do aluno"
          value={alunoId}
          onChangeText={setAlunoId}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data da Avaliação (DD/MM/AAAA):</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 01/01/2023"
          keyboardType="numbers-and-punctuation"
          value={dataAvaliacao}
          onChangeText={setDataAvaliacao}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Peso (kg):</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o peso"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Altura (m):</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a altura"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>IMC:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o IMC"
          keyboardType="numeric"
          value={imc}
          onChangeText={setImc}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Percentual de Gordura (%):</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o percentual de gordura"
          keyboardType="numeric"
          value={percentualGordura}
          onChangeText={setPercentualGordura}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEdit ? 'Salvar Alterações' : 'Salvar Avaliação'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar para Cadastro</Text>
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
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
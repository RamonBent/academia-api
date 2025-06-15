import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVALIACAO_STORAGE_KEY = '@myApp:avaliacoesFisicas';

export default function AvaliacaoFisicaForm() {
  const router = useRouter();
  const [alunoId, setAlunoId] = useState('');
  const [dataAvaliacao, setDataAvaliacao] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState('');
  const [percentualGordura, setPercentualGordura] = useState('');

  useEffect(() => {
    const loadAvaliacoes = async () => {
      try {
        const storedAvaliacoes = await AsyncStorage.getItem(AVALIACAO_STORAGE_KEY);
        if (storedAvaliacoes !== null) {
          let avaliacoes = JSON.parse(storedAvaliacoes);
          console.log("Loaded avaliações físicas:", avaliacoes);
        }
      } catch (error) {
        console.error("Error loading avaliações físicas from AsyncStorage", error);
      }
    };

    loadAvaliacoes();
  }, []);

  const handleSubmit = async () => {
    if (alunoId && dataAvaliacao && peso && altura && imc && percentualGordura) {
      const newAvaliacao = {
        id: Date.now().toString(),
        alunoId,
        dataAvaliacao,
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        imc: parseFloat(imc),
        percentualGordura: parseFloat(percentualGordura),
      };

      try {
        const existingAvaliacoesJson = await AsyncStorage.getItem(AVALIACAO_STORAGE_KEY);
        let avaliacoes = existingAvaliacoesJson ? JSON.parse(existingAvaliacoesJson) : [];

        avaliacoes.push(newAvaliacao);

        await AsyncStorage.setItem(AVALIACAO_STORAGE_KEY, JSON.stringify(avaliacoes));

        Alert.alert('Avaliação Física cadastrada com sucesso!', `Dados da Avaliação\nAluno ID: ${alunoId}\nData: ${dataAvaliacao}\nPeso: ${peso}kg\nAltura: ${altura}m\nIMC: ${imc}\n% Gordura: ${percentualGordura}`);

        setAlunoId('');
        setDataAvaliacao('');
        setPeso('');
        setAltura('');
        setImc('');
        setPercentualGordura('');
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar a avaliação física. Por favor, tente novamente.');
        console.error("Error saving avaliação física to AsyncStorage", error);
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Formulário de Cadastro de Avaliação Física</Text>

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
        <Text style={styles.submitButtonText}>Salvar Avaliação</Text>
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
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INSTRUTOR_STORAGE_KEY = '@myApp:instrutores';

export default function InstrutorForm() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cref, setCref] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadInstrutores = async () => {
      try {
        const storedInstrutores = await AsyncStorage.getItem(INSTRUTOR_STORAGE_KEY);
        if (storedInstrutores !== null) {
          let instrutores = JSON.parse(storedInstrutores);
          console.log("Loaded instrutores:", instrutores);
        }
      } catch (error) {
        console.error("Error loading instrutores from AsyncStorage", error);
      }
    };

    loadInstrutores();
  }, []);

  const handleSubmit = async () => {
    if (nome && cref && especialidade && telefone && email) {
      const newInstrutor = {
        id: Date.now().toString(),
        nome,
        cref,
        especialidade,
        telefone,
        email,
      };

      try {
        const existingInstrutoresJson = await AsyncStorage.getItem(INSTRUTOR_STORAGE_KEY);
        let instrutores = existingInstrutoresJson ? JSON.parse(existingInstrutoresJson) : [];

        instrutores.push(newInstrutor);

        await AsyncStorage.setItem(INSTRUTOR_STORAGE_KEY, JSON.stringify(instrutores));

        Alert.alert('Instrutor cadastrado com sucesso!', `Dados do Instrutor\nNome: ${nome}\nCREF: ${cref}\nEspecialidade: ${especialidade}\nTelefone: ${telefone}\nEmail: ${email}`);

        setNome('');
        setCref('');
        setEspecialidade('');
        setTelefone('');
        setEmail('');
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o instrutor. Por favor, tente novamente.');
        console.error("Error saving instrutor to AsyncStorage", error);
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Formulário de Cadastro de Instrutor</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome Completo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do instrutor"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Número CREF:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o CREF"
          value={cref}
          onChangeText={setCref}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Especialidade:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Musculação, Pilates"
          value={especialidade}
          onChangeText={setEspecialidade}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Telefone:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o telefone"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Salvar Instrutor</Text>
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
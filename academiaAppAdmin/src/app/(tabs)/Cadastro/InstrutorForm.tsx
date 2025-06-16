import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INSTRUTOR_STORAGE_KEY = '@myApp:instrutores';

export default function InstrutorForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [nome, setNome] = useState('');
  const [cref, setCref] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const loadInstrutor = async () => {
      if (id) {
        try {
          const stored = await AsyncStorage.getItem(INSTRUTOR_STORAGE_KEY);
          if (stored) {
            const instrutores = JSON.parse(stored);
            const instrutor = instrutores.find((a) => a.id === id);
            if (instrutor) {
              setNome(instrutor.nome);
              setCref(instrutor.cref);
              setEspecialidade(instrutor.especialidade);
              setTelefone(instrutor.telefone);
              setEmail(instrutor.email);
              setIsEdit(true);
            }
          }
        } catch (error) {
          Alert.alert('Erro', 'Erro ao carregar instrutor para edição.');
        }
      }
    };
    loadInstrutor();
  }, [id]);

  const handleSubmit = async () => {
    if (nome && cref && especialidade && telefone && email) {
      try {
        const stored = await AsyncStorage.getItem(INSTRUTOR_STORAGE_KEY);
        let instrutores = stored ? JSON.parse(stored) : [];
        if (isEdit) {
          instrutores = instrutores.map((a) =>
            a.id === id
              ? { ...a, nome, cref, especialidade, telefone, email }
              : a
          );
        } else {
          instrutores.push({
            id: Date.now().toString(),
            nome,
            cref,
            especialidade,
            telefone,
            email,
          });
        }
        await AsyncStorage.setItem(INSTRUTOR_STORAGE_KEY, JSON.stringify(instrutores));
        router.back();
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar instrutor.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Editar Instrutor' : 'Formulário de Cadastro de Instrutor'}
      </Text>

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
        <Text style={styles.submitButtonText}>
          {isEdit ? 'Salvar Alterações' : 'Salvar Instrutor'}
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
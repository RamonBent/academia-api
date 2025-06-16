import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

const STUDENTS_STORAGE_KEY = '@myApp:students';

export default function AlunoForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      if (id) {
        try {
          const stored = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
          if (stored) {
            const students = JSON.parse(stored);
            const aluno = students.find((a) => a.id === id);
            if (aluno) {
              setNome(aluno.nome);
              setIdade(aluno.idade.toString());
              setEmail(aluno.email);
              setTelefone(aluno.telefone);
              setIsEdit(true);
            }
          }
        } catch (error) {
          Alert.alert('Erro', 'Erro ao carregar aluno para edição.');
        }
      }
    };
    loadStudent();
  }, [id]);

  const handleSubmit = async () => {
    if (nome && idade && email && telefone) {
      try {
        const stored = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
        let students = stored ? JSON.parse(stored) : [];
        if (isEdit) {
          // Edit mode: update existing
          students = students.map((a) =>
            a.id === id
              ? { ...a, nome: nome.trim(), idade: parseInt(idade), email, telefone }
              : a
          );
        } else {
          // Create mode: add new
          students.push({
            id: Date.now().toString(),
            nome: nome.trim(),
            idade: parseInt(idade),
            email,
            telefone,
          });
        }
        await AsyncStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
        router.back();
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar aluno.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Editar Aluno' : 'Formulário de Cadastro de Aluno'}
      </Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do aluno"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          value={idade}
          onChangeText={setIdade}
          placeholder="Idade"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Telefone"
          keyboardType="phone-pad"
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
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
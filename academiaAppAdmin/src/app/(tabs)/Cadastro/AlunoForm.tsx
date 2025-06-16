import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react'; 

const STUDENTS_STORAGE_KEY = '@myApp:students';

export default function AlunoForm() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const storedStudents = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
        if (storedStudents !== null) {
          let students = JSON.parse(storedStudents);
          console.log("Loaded students:", students);
        }
      } catch (error) {
        console.error("Error loading students from AsyncStorage", error);
      }
    };

    loadStudents();
  }, []);

  const handleSubmit = async () => {
    if (nome && idade && email && telefone) {
      const newStudent = {
        id: Date.now().toString(),
        nome: nome.trim(),
        idade: parseInt(idade),
        email,
        telefone,
      };

      try {
        const existingStudentsJson = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
        let students = existingStudentsJson ? JSON.parse(existingStudentsJson) : [];

        students.push(newStudent);

        await AsyncStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));

        Alert.alert('Aluno cadastrado com sucesso!', `Dados do Aluno\nNome: ${nome}\nIdade: ${idade}\nEmail: ${email}\nTelefone: ${telefone}`);
        
        setNome('');
        setIdade('');
        setEmail('');
        setTelefone('');
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o aluno. Por favor, tente novamente.');
        console.error("Error saving student to AsyncStorage", error);
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Formulário de Cadastro de Aluno</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome Completo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do aluno"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Idade:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a idade"
          keyboardType="numeric"
          value={idade}
          onChangeText={setIdade}
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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Salvar Aluno</Text>
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
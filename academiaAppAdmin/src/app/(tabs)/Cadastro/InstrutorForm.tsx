import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function InstrutorForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cref, setCref] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInstrutor = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/instrutores/${id}`);
          if (!response.ok) throw new Error('Instrutor não encontrado');

          const instrutor = await response.json();
          setNome(instrutor.nome || '');
          setCpf(instrutor.cpf || '');
          setCref(instrutor.numeroCREEF || '');
          setTelefone(instrutor.telefone || '');
          setEmail(instrutor.email || '');
          setIsEdit(true);
        } catch (error) {
          Alert.alert('Erro', 'Erro ao carregar instrutor para edição.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadInstrutor();
  }, [id]);

  const handleSubmit = async () => {
    if (!nome || !cpf || !cref || !telefone || !email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const instrutorData = { nome, cpf, telefone, email, numeroCREEF: cref };
      let response;

      if (isEdit && id) {
        response = await fetch(`${API_BASE_URL}/api/instrutores/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(instrutorData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/instrutores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(instrutorData),
        });
      }

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      Alert.alert('Sucesso', isEdit ? 'Instrutor atualizado!' : 'Instrutor criado!');
      if (isEdit) {
        router.replace('/(tabs)/Listagem/ListarInstrutores');
      } else {
        router.back();
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar instrutor. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        {isEdit ? 'Editar Instrutor' : 'Formulário de Cadastro de Instrutor'}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome Completo:</Text>
        <TextInput style={styles.input} placeholder="Digite o nome do instrutor" value={nome} onChangeText={setNome} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CPF:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o CPF"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
          maxLength={14}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Número CREF:</Text>
        <TextInput style={styles.input} placeholder="Digite o CREF" value={cref} onChangeText={setCref} />
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
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>{isEdit ? 'Salvar Alterações' : 'Salvar Instrutor'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={loading}>
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

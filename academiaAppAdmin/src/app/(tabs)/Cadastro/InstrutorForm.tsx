import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';
import { saveOfflineData } from '../../../services/syncService'; // Assuming this path is correct

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
  const [isOnline, setIsOnline] = useState(true); // State to track network status

  // Effect to listen for network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  // Effect to load instructor data for editing
  useEffect(() => {
    const loadInstrutor = async () => {
      if (id) {
        // If offline, prevent loading for edit and inform user
        if (!isOnline) {
          Alert.alert('Aviso', 'Você está offline. Não é possível carregar dados para edição.');
          router.back(); // Go back if cannot load for edit
          return;
        }
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
        } catch (error: any) {
          Alert.alert('Erro', 'Erro ao carregar instrutor para edição: ' + error.message);
        }
      }
    };
    loadInstrutor();
  }, [id, isOnline]); // Re-run if online status changes for edit mode

  // Handles form submission (create or update)
  const handleSubmit = async () => {
    if (!nome || !cpf || !cref || !telefone || !email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const instrutorData = {
      nome,
      cpf,
      telefone,
      email,
      numeroCREEF: cref,
    };

    if (isEdit) {
      await handleEdit(instrutorData);
    } else {
      await handleCreate(instrutorData);
    }
  };

  // Handles updating an existing instructor
  const handleEdit = async (instrutorData: any) => {
    // Edits are only allowed when online
    if (!isOnline) {
      Alert.alert('Aviso', 'Você está offline. Edições só podem ser feitas online.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/instrutores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instrutorData),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição à API ao atualizar');
      }

      Alert.alert('Sucesso', 'Instrutor atualizado com sucesso!');
      router.replace('/(tabs)/Listagem/ListarInstrutores');
    } catch (error: any) {
      console.error("Erro ao atualizar instrutor online:", error);
      Alert.alert('Erro', 'Não foi possível atualizar o instrutor: ' + error.message);
    }
  };

  // Handles creating a new instructor
  const handleCreate = async (instrutorData: any) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/instrutores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(instrutorData),
        });

        if (!response.ok) {
          throw new Error('Erro na requisição à API ao cadastrar');
        }

        Alert.alert('Sucesso', 'Instrutor cadastrado com sucesso!');
        router.back();
      } catch (error: any) {
        console.error("Erro ao cadastrar instrutor online:", error);
        // If online request fails, try to save offline
        await saveOfflineAndAlert(instrutorData);
      }
    } else {
      // If offline, directly save offline
      await saveOfflineAndAlert(instrutorData);
    }
  };

  // Saves data offline and shows an alert
  const saveOfflineAndAlert = async (data: any) => {
    const success = await saveOfflineData(data, 'instrutores'); // 'instrutores' as collection name
    if (success) {
      Alert.alert(
        'Modo Offline',
        'Instrutor salvo localmente. Os dados serão sincronizados quando a conexão for restaurada.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('Erro', 'Falha ao salvar o instrutor localmente.');
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        {isEdit ? 'Editar Instrutor' : 'Formulário de Cadastro de Instrutor'}
      </Text>

      {/* Offline banner for new registrations */}
      {!isOnline && !isEdit && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Você está offline. Os dados serão sincronizados quando a conexão for restaurada.</Text>
        </View>
      )}

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
        <Text style={styles.label}>CPF:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o CPF"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
          maxLength={14} // formato com pontos e traço: 000.000.000-00
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
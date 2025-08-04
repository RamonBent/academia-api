import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';
import { saveOfflineData } from '../../../services/syncService';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function InstrutorForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    numeroCreef: '',
    telefone: '',
    email: ''
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadInstrutor = async () => {
      if (id) {
        if (!isOnline) {
          Alert.alert('Aviso', 'Você está offline. Não é possível carregar dados para edição.');
          router.back();
          return;
        }
        try {
          const response = await fetch(`${API_BASE_URL}/api/instrutores/${id}`);
          if (!response.ok) throw new Error('Instrutor não encontrado');

          const instrutor = await response.json();
          setForm({
            nome: instrutor.nome || '',
            cpf: instrutor.cpf || '',
            numeroCreef: instrutor.numeroCreef || '',
            telefone: instrutor.telefone || '',
            email: instrutor.email || ''
          });
          setIsEdit(true);
        } catch (error) {
          Alert.alert('Erro', 'Erro ao carregar instrutor para edição');
          router.back();
        }
      }
    };
    loadInstrutor();
  }, [id, isOnline]);

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.cpf || !form.numeroCreef || !form.telefone || !form.email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit) {
        await handleEdit();
      } else {
        await handleCreate();
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao processar sua solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!isOnline) {
      Alert.alert('Aviso', 'Você está offline. Edições só podem ser feitas online.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/instrutores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar instrutor');
      }

      Alert.alert('Sucesso', 'Instrutor atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      throw error;
    }
  };

  const handleCreate = async () => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/instrutores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(form)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao cadastrar instrutor');
        }

        Alert.alert('Sucesso', 'Instrutor cadastrado com sucesso!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } catch (error) {
        await saveOfflineAndAlert();
      }
    } else {
      await saveOfflineAndAlert();
    }
  };

  const saveOfflineAndAlert = async () => {
    try {
      await saveOfflineData(form, 'instrutores');
      Alert.alert(
        'Modo Offline',
        'Instrutor salvo localmente. Os dados serão sincronizados quando a conexão for restaurada.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar o instrutor localmente.');
    }
  };

  const handleBack = () => {
    if (isSubmitting) return;
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {isEdit ? 'Editar Instrutor' : 'Formulário de Cadastro de Instrutor'}
        </Text>

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
            value={form.nome}
            onChangeText={(text) => handleChange('nome', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CPF:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o CPF"
            keyboardType="numeric"
            value={form.cpf}
            onChangeText={(text) => handleChange('cpf', text)}
            maxLength={14}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número CREF:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o CREF"
            value={form.numeroCreef}
            onChangeText={(text) => handleChange('numeroCreef', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o telefone"
            keyboardType="phone-pad"
            value={form.telefone}
            onChangeText={(text) => handleChange('telefone', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Salvar Alterações' : 'Salvar Instrutor'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.backButton, isSubmitting && styles.disabledButton]} 
          onPress={handleBack}
          disabled={isSubmitting}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, 
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
  disabledButton: {
    opacity: 0.6,
  },
});
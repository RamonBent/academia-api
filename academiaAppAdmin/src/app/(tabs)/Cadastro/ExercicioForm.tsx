import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ExercicioForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    nome: '',
    grupoMuscular: '',
    series: '',
    repeticoes: '',
    carga: '',
    descansoSegundos: '',
    treinoId: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`${API_BASE_URL}/api/exercicios/${id}`)
        .then(response => {
          const exercicio = response.data;
          setForm({
            nome: exercicio.nome || '',
            grupoMuscular: exercicio.grupoMuscular || '',
            series: exercicio.series?.toString() || '',
            repeticoes: exercicio.repeticoes?.toString() || '',
            carga: exercicio.carga?.toString() || '',
            descansoSegundos: exercicio.descansoSegundos?.toString() || '',
            treinoId: exercicio.treinoId?.toString() || ''
          });
          setIsEdit(true);
        })
        .catch(() => Alert.alert('Erro', 'Erro ao carregar exercício para edição.'));
    }
  }, [id]);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.grupoMuscular || !form.series || !form.repeticoes || !form.descansoSegundos || !form.treinoId) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const exercicioRequest = {
        ...form,
        series: parseInt(form.series),
        repeticoes: parseInt(form.repeticoes),
        carga: form.carga ? parseFloat(form.carga) : null,
        descansoSegundos: parseInt(form.descansoSegundos),
        treinoId: parseInt(form.treinoId)
      };

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/exercicios/${id}`, exercicioRequest);
        Alert.alert('Sucesso', 'Exercício atualizado com sucesso!');
      } else {
        await axios.post(`${API_BASE_URL}/api/exercicios`, exercicioRequest);
        Alert.alert('Sucesso', 'Exercício cadastrado com sucesso!');
      }
      
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao salvar exercício.');
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        {isEdit ? 'Editar Exercício' : 'Cadastrar Novo Exercício'}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome*</Text>
        <TextInput
          style={styles.input}
          value={form.nome}
          onChangeText={(text) => handleChange('nome', text)}
          placeholder="Nome do exercício"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Grupo Muscular*</Text>
        <TextInput
          style={styles.input}
          value={form.grupoMuscular}
          onChangeText={(text) => handleChange('grupoMuscular', text)}
          placeholder="Ex: Peito, Costas, Pernas"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Séries*</Text>
        <TextInput
          style={styles.input}
          value={form.series}
          onChangeText={(text) => handleChange('series', text)}
          placeholder="Número de séries"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Repetições*</Text>
        <TextInput
          style={styles.input}
          value={form.repeticoes}
          onChangeText={(text) => handleChange('repeticoes', text)}
          placeholder="Número de repetições"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Carga (kg)</Text>
        <TextInput
          style={styles.input}
          value={form.carga}
          onChangeText={(text) => handleChange('carga', text)}
          placeholder="Peso em kg (opcional)"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descanso (segundos)*</Text>
        <TextInput
          style={styles.input}
          value={form.descansoSegundos}
          onChangeText={(text) => handleChange('descansoSegundos', text)}
          placeholder="Tempo de descanso entre séries"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ID do Treino*</Text>
        <TextInput
          style={styles.input}
          value={form.treinoId}
          onChangeText={(text) => handleChange('treinoId', text)}
          placeholder="ID do treino associado"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEdit ? 'Salvar Alterações' : 'Salvar Exercício'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
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
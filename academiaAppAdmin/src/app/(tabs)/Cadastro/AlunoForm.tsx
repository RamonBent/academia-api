import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, 
  TouchableOpacity, Alert, FlatList, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const API_BASE_URL = "http://192.168.1.108:8080/api/alunos"; 
const API_INSTRUTORES_URL = "http://192.168.1.108:8080/api/instrutores";

export default function AlunoForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState('');
  const [nomeSugestoes, setNomeSugestoes] = useState<string[]>([]);
  const [showNomeSugestoes, setShowNomeSugestoes] = useState(false);

  const [selectedDay, setSelectedDay] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [dataNascimento, setDataNascimento] = useState('');

  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [plano, setPlano] = useState('');
  const [instrutorId, setInstrutorId] = useState<string | null>(null);

  const [instrutores, setInstrutores] = useState<{ id: number; nome: string }[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    axios.get(API_INSTRUTORES_URL)
      .then(response => setInstrutores(response.data))
      .catch(() => Alert.alert("Erro", "Não foi possível carregar a lista de instrutores."));
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`${API_BASE_URL}/${id}`)
        .then(response => {
          const aluno = response.data;
          setNome(aluno.nome);
          if (aluno.dataNascimento) {
            const date = new Date(aluno.dataNascimento);
            setSelectedDay(date.getDate().toString());
            setSelectedMonth((date.getMonth() + 1).toString());
            setSelectedYear(date.getFullYear().toString());
            setDataNascimento(formatDate(date));
          }
          setEmail(aluno.email);
          setTelefone(aluno.telefone);
          setEndereco(aluno.endereco || '');
          setPlano(aluno.plano || '');
          setInstrutorId(aluno.instrutorId ? aluno.instrutorId.toString() : null);
          setIsEdit(true);
        })
        .catch(() => Alert.alert("Erro", "Não foi possível carregar os dados do aluno."));
    }
  }, [id]);

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const day = selectedDay.padStart(2, '0');
      const month = selectedMonth.padStart(2, '0');
      setDataNascimento(`${day}/${month}/${selectedYear}`);  // dd/MM/yyyy
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  useEffect(() => {
    if (nome.trim().length > 0) {
      axios.get(`${API_BASE_URL}?nome=${nome}`)
        .then(response => {
          const nomes = response.data
            .map((aluno: any) => aluno.nome)
            .filter((n: string) => n.toLowerCase() !== nome.toLowerCase());
          setNomeSugestoes(nomes);
          setShowNomeSugestoes(true);
        })
        .catch(() => {
          setNomeSugestoes([]);
          setShowNomeSugestoes(false);
        });
    } else {
      setNomeSugestoes([]);
      setShowNomeSugestoes(false);
    }
  }, [nome]);

  const selecionarNomeSugestao = (nomeSelecionado: string) => {
    setNome(nomeSelecionado);
    setShowNomeSugestoes(false);
    Keyboard.dismiss();
  };

  function formatDate(date: Date): string {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  // Note que agora o backend espera data no formato dd/MM/yyyy, então enviaremos assim
  const handleSubmit = async () => {
    if (!nome || !selectedDay || !selectedMonth || !selectedYear || !email || !telefone) {
      Alert.alert("Erro", "Preencha os campos obrigatórios: Nome, Data de Nascimento, Email e Telefone.");
      return;
    }

    const alunoRequest = {
      nome: nome.trim(),
      dataNascimento: dataNascimento,  // enviar no formato dd/MM/yyyy
      email: email.trim(),
      telefone: telefone.trim(),
      endereco: endereco.trim() || null,
      plano: plano.trim() || null,
      instrutorId: instrutorId ? parseInt(instrutorId) : null,
    };

    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/${id}`, alunoRequest);
        Alert.alert("Sucesso", "Aluno atualizado com sucesso!");
      } else {
        await axios.post(API_BASE_URL, alunoRequest);
        Alert.alert("Sucesso", "Aluno cadastrado com sucesso!");
      }
      router.back();
    } catch (error) {
      console.error("Erro ao salvar aluno:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível salvar o aluno.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowNomeSugestoes(false)}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          {isEdit ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome do aluno"
            autoCorrect={false}
            autoCapitalize="words"
          />
          {showNomeSugestoes && nomeSugestoes.length > 0 && (
            <FlatList
              data={nomeSugestoes}
              keyExtractor={(item, index) => index.toString()}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selecionarNomeSugestao(item)} style={styles.suggestionItem}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data de Nascimento *</Text>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerColumn}>
              <Text style={styles.datePickerLabel}>Dia</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedDay}
                  onValueChange={(itemValue) => setSelectedDay(itemValue)}
                  style={styles.picker}
                >
                  {days.map(day => (
                    <Picker.Item key={`day-${day}`} label={day} value={day} />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.datePickerColumn}>
              <Text style={styles.datePickerLabel}>Mês</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                  style={styles.picker}
                >
                  {months.map(month => (
                    <Picker.Item key={`month-${month}`} label={month} value={month} />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.datePickerColumn}>
              <Text style={styles.datePickerLabel}>Ano</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(itemValue) => setSelectedYear(itemValue)}
                  style={styles.picker}
                >
                  {years.map(year => (
                    <Picker.Item key={`year-${year}`} label={year} value={year} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          <Text style={styles.selectedDateText}>
            Data selecionada: {dataNascimento || 'Nenhuma data selecionada'}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Telefone"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Endereço"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Plano</Text>
          <TextInput
            style={styles.input}
            value={plano}
            onChangeText={setPlano}
            placeholder="Plano"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instrutor</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={instrutorId}
              onValueChange={(itemValue) => setInstrutorId(itemValue)}
              mode="dropdown"
              style={styles.picker}
            >
              <Picker.Item label="Selecione um instrutor" value={null} />
              {instrutores.map(instrutor => (
                <Picker.Item key={instrutor.id} label={instrutor.nome} value={instrutor.id.toString()} />
              ))}
            </Picker>
          </View>
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5, color: '#555' },
  input: { backgroundColor: '#e0e0e0', padding: 12, borderRadius: 8, fontSize: 16, height: 45 },
  suggestionsList: { backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, maxHeight: 100, marginTop: 2, borderRadius: 5 },
  suggestionItem: { padding: 10, borderBottomColor: '#eee', borderBottomWidth: 1 },
  pickerWrapper: { backgroundColor: '#e0e0e0', borderRadius: 8, overflow: 'hidden' },
  picker: { height: 50, width: '100%' },
  datePickerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  datePickerColumn: { flex: 1, marginHorizontal: 2 },
  datePickerLabel: { fontSize: 14, color: '#555', marginBottom: 5, textAlign: 'center' },
  selectedDateText: { textAlign: 'center', marginTop: 5, color: '#555' },
  submitButton: { backgroundColor: '#28a745', paddingVertical: 15, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  backButton: { backgroundColor: '#6c757d', paddingVertical: 10, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  backButtonText: { color: 'white', fontSize: 16 },
});

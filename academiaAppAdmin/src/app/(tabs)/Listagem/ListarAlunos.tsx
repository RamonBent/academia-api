import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const API_BASE_URL = "http://192.168.1.108:8080/api/alunos";

export default function ListarAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchAlunos();
  }, []);

  useEffect(() => {
    if (filtro.trim() === '') {
      setAlunosFiltrados(alunos);
    } else {
      const filtroMinusculo = filtro.toLowerCase();
      setAlunosFiltrados(
        alunos.filter(aluno => 
          aluno.nome && aluno.nome.toLowerCase().includes(filtroMinusculo)
        )
      );
    }
  }, [filtro, alunos]);

  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setAlunos(response.data);
      setAlunosFiltrados(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lista de alunos.");
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAluno = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      
      // Atualização otimista - remove o aluno da lista antes de recarregar
      setAlunos(prevAlunos => prevAlunos.filter(aluno => aluno.id !== id));
      
      Alert.alert("Sucesso", "Aluno excluído com sucesso!");
      
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      Alert.alert("Erro", "Não foi possível excluir o aluno.");
      // Recarrega a lista em caso de erro para garantir consistência
      fetchAlunos();
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (id) => {
    setEditingId(id);
    try {
      router.push({ 
        pathname: '/Cadastro/AlunoForm', 
        params: { id: id.toString() }
      });
    } catch (error) {
      console.error("Erro ao navegar para edição:", error);
      Alert.alert("Erro", "Não foi possível abrir a edição");
    } finally {
      setEditingId(null);
    }
  };

  if (loading && alunos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lista de Alunos</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar aluno pelo nome"
        value={filtro}
        onChangeText={setFiltro}
        autoCapitalize="none"
      />

      {alunosFiltrados.length === 0 ? (
        <Text style={styles.emptyText}>
          {filtro ? 'Nenhum aluno encontrado com este nome.' : 'Nenhum aluno cadastrado.'}
        </Text>
      ) : (
        alunosFiltrados.map((aluno) => (
          <View key={aluno.id} style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.name}>{aluno.nome || 'Nome não informado'}</Text>
              {aluno.dataNascimento ? (
                <Text>Idade: {calcularIdade(aluno.dataNascimento)}</Text>
              ) : (
                <Text>Idade: Não informada</Text>
              )}
              <Text>Email: {aluno.email || '-'}</Text>
              <Text>Telefone: {aluno.telefone || '-'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.editButton, editingId === aluno.id && styles.disabledButton]}
              onPress={() => handleEdit(aluno.id)}
              disabled={editingId === aluno.id}
            >
              {editingId === aluno.id ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.editButtonText}>Editar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteButton, deletingId === aluno.id && styles.disabledButton]}
              onPress={() => deleteAluno(aluno.id)}
              disabled={deletingId === aluno.id}
            >
              {deletingId === aluno.id ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.deleteButtonText}>Excluir</Text>
              )}
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function calcularIdade(dataNascimentoISO) {
  if (!dataNascimentoISO) return 'N/A';
  
  const hoje = new Date();
  const nascimento = new Date(dataNascimentoISO);
  
  if (isNaN(nascimento.getTime())) return 'Data inválida';
  
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 25,
    alignSelf: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
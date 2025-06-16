import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const INSTRUTOR_STORAGE_KEY = '@myApp:instrutores';

export default function ListarInstrutores() {
    const [instrutores, setInstrutores] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const loadInstrutores = async () => {
            try {
                const storedInstrutores = await AsyncStorage.getItem(INSTRUTOR_STORAGE_KEY);
                if (storedInstrutores !== null) {
                    setInstrutores(JSON.parse(storedInstrutores));
                }
            } catch (error) {
                console.error("Error loading instrutores from AsyncStorage", error);
            }
        };

        loadInstrutores();
    }, []);

    const handleDelete = async (id) => {
        const filtered = instrutores.filter((instrutor) => instrutor.id !== id);
        setInstrutores(filtered);
        await AsyncStorage.setItem(INSTRUTOR_STORAGE_KEY, JSON.stringify(filtered));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Lista de Instrutores</Text>
            {instrutores.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum instrutor cadastrado.</Text>
            ) : (
                instrutores.map((instrutor, index) => (
                    <View key={instrutor.id || index} style={styles.cardRow}>
                        <View style={styles.card}>
                            <Text style={styles.name}>{instrutor.nome || 'Nome não informado'}</Text>
                            <Text>CREF: {instrutor.cref}</Text>
                            <Text>Especialidade: {instrutor.especialidade}</Text>
                            <Text>Telefone: {instrutor.telefone}</Text>
                            <Text>Email: {instrutor.email}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {/* Ação de Editar */ }}
                        >
                            <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDelete(instrutor.id)}
                        >
                            <Text style={styles.deleteButtonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Voltar para Listagem</Text>
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
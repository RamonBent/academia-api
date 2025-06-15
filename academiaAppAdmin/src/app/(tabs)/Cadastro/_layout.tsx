import { Stack } from 'expo-router';
import React from 'react';

export default function CadastroStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      
      <Stack.Screen name="index" options={{ title: 'Cadastro Principal' }} />
      <Stack.Screen name="AlunoForm" options={{ title: 'Cadastrar Aluno' }} />
      <Stack.Screen name="AvaliacaoFisicaForm" options={{ title: 'Cadastrar Avaliação Física' }} />
      <Stack.Screen name="ExercicioForm" options={{ title: 'Cadastrar Exercício' }} />
      <Stack.Screen name="InstrutorForm" options={{ title: 'Cadastrar Instrutor' }} />
      <Stack.Screen name="TreinoForm" options={{ title: 'Cadastrar Treino' }} />
    </Stack>
  );
}
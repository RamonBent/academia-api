import { Stack } from 'expo-router';
import React from 'react';

export default function CadastroStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      
      <Stack.Screen name="index" options={{ title: 'Listagem' }} />
      <Stack.Screen name="ListarAlunos" options={{ title: 'Listar Alunos' }} />
      <Stack.Screen name="ListarAvaliacaoFisica" options={{ title: 'Listar Avaliações Física' }} />
      <Stack.Screen name="ListarExercicios" options={{ title: 'Listar Exercícios' }} />
      <Stack.Screen name="ListarInstrutores" options={{ title: 'Listar Instrutores' }} />
      <Stack.Screen name="ListarTreinos" options={{ title: 'Listar Treinos' }} />
    </Stack>
  );
}
import { Redirect } from 'expo-router';

export default function App() {
  // Redireciona para a tela 'HomeScreen' dentro do grupo de abas
  return <Redirect href="/HomeScreen" />;
}
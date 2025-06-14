import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout(){
    return(
        <Tabs  screenOptions={{
        tabBarActiveTintColor: '#FFF', // Cor do ícone e texto ativos (ex: azul)
        tabBarInactiveTintColor: 'gray',  // Cor do ícone e texto inativos
        tabBarStyle: {
          backgroundColor: 'black', // Cor de fundo da barra de abas
        },
        tabBarLabelStyle: {
          fontSize: 12, 
          marginBottom: 2, // Espaçamento entre texto e ícone
        },
        }}
        >
            
            <Tabs.Screen
                name="Cadastro" // Nome do arquivo: Cadastro.tsx
                options={{
                title: 'Cadastro', // Título que aparece na aba
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <FontAwesome name="plus" size={24} color={focused ? color : 'gray'} /> // Ícone de mais
                ),
                }}
            />

            <Tabs.Screen
                name="HomeScreen" // Nome do arquivo: HomeScreen.tsx
                options={{
                title: 'Home', // Título que aparece na aba
                headerShown: false, // Oculta o cabeçalho no topo da tela, se você já tem um design customizado
                tabBarIcon: ({ color, focused }) => (
                    <FontAwesome name="home" size={24} color={focused ? color : 'gray'} /> // Ícone de casa
                ),
                }}
            />
            
            <Tabs.Screen
                name="Listagem" // Nome do arquivo: Cadastro.tsx
                options={{
                title: 'Listagem',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <FontAwesome name="bars" size={24} color={focused ? color : 'gray'} /> // Ícone de casa
                ),
                }}
            />
        </Tabs>
    )
}
import { Button, Text, View } from "react-native";
import Treino from "./components/Treino";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Treino title='Costas' duration='30 minutos' calories={350} numberExercises='10 exercícios'/>
    </View>
  );
}
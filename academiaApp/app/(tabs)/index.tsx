// /app/index.tsx
import { View, Text } from 'react-native';
import Treino from '../../components/Treino';


export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Treino title='Costas' duration='30 minutos' calories={350} numberExercises='10 exercícios'/>
    </View>
  );
}

import { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ExerciseCard from '../../components/ExerciseCard';

const exercises = [
  { 
    title: 'Flexão de Braço', 
    duration: '3x12', 
    calories: 80, 
    numberExercises: '1 exercício', 
    descricao: 'Exercício para peitoral e tríceps.', 
    imagem: 'https://via.placeholder.com/300x180?text=Flexao' 
  },
  { 
    title: 'Agachamento', 
    duration: '4x10', 
    calories: 100, 
    numberExercises: '1 exercício', 
    descricao: 'Trabalha pernas e glúteos.', 
    imagem: 'https://via.placeholder.com/300x180?text=Agachamento' 
  },
  { 
    title: 'Corrida', 
    duration: '20 min', 
    calories: 200, 
    numberExercises: '1 exercício', 
    descricao: 'Exercício aeróbico.', 
    imagem: 'https://via.placeholder.com/300x180?text=Corrida' 
  },
  { 
    title: 'Prancha', 
    duration: '3x40s', 
    calories: 60, 
    numberExercises: '1 exercício', 
    descricao: 'Fortalece o core.', 
    imagem: 'https://via.placeholder.com/300x180?text=Prancha' 
  },
  { 
    title: 'Bicicleta', 
    duration: '30 min', 
    calories: 250, 
    numberExercises: '1 exercício', 
    descricao: 'Exercício cardiovascular.', 
    imagem: 'https://via.placeholder.com/300x180?text=Bicicleta' 
  },
  { 
    title: 'Supino', 
    duration: '4x8', 
    calories: 90, 
    numberExercises: '1 exercício', 
    descricao: 'Trabalha peitoral.', 
    imagem: 'https://via.placeholder.com/300x180?text=Supino' 
  },
  { 
    title: 'Abdominal', 
    duration: '3x20', 
    calories: 70, 
    numberExercises: '1 exercício', 
    descricao: 'Fortalece o abdômen.', 
    imagem: 'https://via.placeholder.com/300x180?text=Abdominal' 
  },
  { 
    title: 'Puxada', 
    duration: '3x10', 
    calories: 85, 
    numberExercises: '1 exercício', 
    descricao: 'Exercício para costas.', 
    imagem: 'https://via.placeholder.com/300x180?text=Puxada' 
  },
  { 
    title: 'Tríceps', 
    duration: '3x12', 
    calories: 60, 
    numberExercises: '1 exercício', 
    descricao: 'Trabalha tríceps.', 
    imagem: 'https://via.placeholder.com/300x180?text=Triceps' 
  },
  { 
    title: 'Elevação lateral', 
    duration: '3x15', 
    calories: 55, 
    numberExercises: '1 exercício', 
    descricao: 'Exercício para ombros.', 
    imagem: 'https://via.placeholder.com/300x180?text=Ombro' 
  },
];

export default function ExerciciosScreen() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {exercises.map((ex, idx) => (
          <View key={idx} style={styles.cardWrapper}>
            <ExerciseCard
              title={ex.title}
              duration={ex.duration}
              calories={ex.calories}
              numberExercises={ex.numberExercises}
              onPress={() => setSelected(ex)}
            />
          </View>
        ))}
      </ScrollView>
      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <>
                <Image
                  source={{ uri: selected.imagem }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.modalTitle}>{selected.title}</Text>
                <Text style={styles.modalTipo}>{selected.duration} - {selected.calories} kcal</Text>
                <Text style={styles.modalDesc}>{selected.descricao}</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    alignSelf: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  cardWrapper: {
    marginBottom: 18, // Add vertical gap between cards
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalTipo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: '#222',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
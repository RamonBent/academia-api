import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native'; 

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

type FaixaEtariaApiResponse = {
  [key: string]: number;
};

type FaixaEtariaPieData = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}[];

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(53, 0, 117, ${opacity})`,
  labelColor: () => '#333',
  strokeWidth: 2,
  decimalPlaces: 0,
  propsForLabels: {
    fontSize: 12,
    fontWeight: '500'
  }
};

export default function HomeScreen() {
  const isFocused = useIsFocused(); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totais, setTotais] = useState({
    alunos: 0,
    instrutores: 0,
    treinos: 0,
    avaliacoes: 0,
  });
  const [faixaEtariaPieData, setFaixaEtariaPieData] = useState<FaixaEtariaPieData>([]);

  const faixaEtariaColors = [
    '#6a0dad',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
  ];

  const fetchDadosDaAPI = async () => {
    setError(null);
    setLoading(true);
    setRefreshing(true);
    try {
      if (!API_BASE_URL) {
        throw new Error('API_BASE_URL não configurada. Verifique app.config.js ou app.json.');
      }

      const [alRes, insRes, trRes, avRes, faixaEtariaRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/alunos`),
        axios.get(`${API_BASE_URL}/api/instrutores`),
        axios.get(`${API_BASE_URL}/api/treinos`),
        axios.get(`${API_BASE_URL}/api/avaliacoes`),
        axios.get<FaixaEtariaApiResponse>(`${API_BASE_URL}/api/alunos/faixa-etaria`),
      ]);

      setTotais({
        alunos: alRes.data.length,
        instrutores: insRes.data.length,
        treinos: trRes.data.length,
        avaliacoes: avRes.data.length,
      });

      processarFaixaEtariaParaGrafico(faixaEtariaRes.data);

    } catch (err: any) {
      console.error('Erro ao buscar dados da API:', err);
      setError(`Falha ao carregar dados: ${err.message || 'Erro desconhecido'}. Tente novamente.`);
      Alert.alert('Erro', `Não foi possível carregar os dados. ${err.message || 'Verifique sua conexão ou a configuração da API.'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processarFaixaEtariaParaGrafico = (data: FaixaEtariaApiResponse) => {
    const formattedData: FaixaEtariaPieData = Object.keys(data).map((label, index) => ({
      name: label,
      population: data[label],
      color: faixaEtariaColors[index % faixaEtariaColors.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    }));
    setFaixaEtariaPieData(formattedData);
  };

  useEffect(() => {
    if (isFocused) { 
      fetchDadosDaAPI();
    }
  }, [isFocused]); 

  const onRefresh = () => {
    setRefreshing(true);
    fetchDadosDaAPI();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={styles.placeholderText}>Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6a0dad']}
          />
        }
      >
        <Text style={styles.title}>📊 Painel da Academia</Text>

        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#D32F2F" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.cardContainer}>
          <View style={[styles.card, styles.cardPrimary]}>
            <MaterialCommunityIcons name="account" size={28} color="#fff" />
            <Text style={styles.cardValue}>{totais.alunos}</Text>
            <Text style={styles.cardLabel}>Alunos</Text>
          </View>
          <View style={[styles.card, styles.cardSecondary]}>
            <MaterialCommunityIcons name="dumbbell" size={28} color="#fff" />
            <Text style={styles.cardValue}>{totais.instrutores}</Text>
            <Text style={styles.cardLabel}>Instrutores</Text>
          </View>
          <View style={[styles.card, styles.cardTertiary]}>
            <MaterialCommunityIcons name="clipboard-list" size={28} color="#fff" />
            <Text style={styles.cardValue}>{totais.treinos}</Text>
            <Text style={styles.cardLabel}>Treinos</Text>
          </View>
          <View style={[styles.card, styles.cardQuaternary]}>
            <MaterialCommunityIcons name="chart-line" size={28} color="#fff" />
            <Text style={styles.cardValue}>{totais.avaliacoes}</Text>
            <Text style={styles.cardLabel}>Avaliações</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Distribuição por Faixa Etária dos Alunos</Text>
        {faixaEtariaPieData.length > 0 && faixaEtariaPieData.some(d => d.population > 0) ? (
          <View style={styles.chartWrapper}>
            <PieChart
              data={faixaEtariaPieData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              hasLegend={true}
              absolute
              style={styles.chart}
            />
          </View>
        ) : (
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Nenhum dado de faixa etária disponível.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
    padding: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#350075',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 16,
    color: '#333',
    marginLeft: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    width: '48%',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPrimary: {
    backgroundColor: '#6a0dad',
  },
  cardSecondary: {
    backgroundColor: '#9c27b0',
  },
  cardTertiary: {
    backgroundColor: '#673ab7',
  },
  cardQuaternary: {
    backgroundColor: '#3f51b5',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  cardLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  chartWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  chartPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  placeholderText: {
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderColor: '#EF9A9A',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    marginLeft: 8,
    flexShrink: 1,
  },
});
import { View, Text, Dimensions, StyleSheet, Alert, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react'; // Added useEffect
import { BarChart, PieChart } from 'react-native-chart-kit'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;
const EXERCICIO_STORAGE_KEY = '@myApp:exercicios';
// IMPORTANT: Ensure this IP address is your development machine's actual local IP.
// And the port (8080) matches your Spring Boot application's port.
const API_BASE_URL = "http://192.168.1.76:8080/api/alunos"; 

const chartConfig = {
  backgroundGradientFrom: '#fff', 
  backgroundGradientFromOpacity: 0, 
  backgroundGradientTo: '#fff',   
  backgroundGradientToOpacity: 0.5, 
  color: (opacity = 1) => `rgba(53, 0, 117, ${opacity})`, 
  strokeWidth: 2, 
  barPercentage: 0.7, 
  useShadowColorFromDataset: false, 
};

export default function HomeScreen(){
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [postResponse, setPostResponse] = useState('');

  // Function to fetch data from the backend
  const fetchHelloMessage = async () => {
    console.log('--- Attempting to fetch from backend ---');
    console.log('API_BASE_URL:', API_BASE_URL);
    const requestUrl = `${API_BASE_URL}/hello`;
    console.log('Requesting URL:', requestUrl);

    try {
      // Log the axios request configuration before sending
      console.log('Axios request config:', {
        method: 'get',
        url: requestUrl,
        headers: {
          'Accept': 'application/json', // Standard header for JSON response
          'Content-Type': 'application/json' // If you were sending a body
        }
      });

      const response = await axios.get(requestUrl);
      
      // Log the full response object
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);
      console.log('API Response Data:', response.data); 
      
      Alert.alert('Backend Message', response.data); 
    } catch (error) {
      console.error('--- Error fetching hello message ---');
      console.error('Error object:', error); // Log the full error object for comprehensive debugging

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        Alert.alert(
          'Backend Error', 
          `Status: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`
        );
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an http.ClientRequest in node.js
        console.error('Error request (no response received):', error.request);
        Alert.alert('Network Error', 'No response received from backend. Check network connection or backend availability.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message (request setup issue):', error.message);
        Alert.alert('Request Error', `An error occurred: ${error.message}`);
      }
      Alert.alert('Error', 'Could not connect to backend. Is it running and is the IP correct?');
    }
  };

  // Call fetchHelloMessage when the component mounts
  // This will ensure the API call happens automatically when the screen loads
  useEffect(() => {
    fetchHelloMessage();
  }, []); // Empty dependency array means it runs once on mount

  useFocusEffect(
    React.useCallback(() => {
      const loadExercicios = async () => {
        try {
          const storedExercicios = await AsyncStorage.getItem(EXERCICIO_STORAGE_KEY);
          if (storedExercicios !== null) {
            let parsedExercicios = JSON.parse(storedExercicios);
            setExercicios(parsedExercicios); 
            console.log("Exercícios carregados para o charts:", parsedExercicios);
          } else {
            setExercicios([]);
          }
        } catch (error) {
          console.error("Erro de carregamento de exercícios do AsyncStorage para o charts", error);
          setExercicios([]);
        }
      };

      loadExercicios();
    }, [])
  );

  // Processar dados para os gráficos a partir de 'exercicios'
  const gruposMuscularesCount: { [key: string]: number } = {};
  exercicios.forEach(exercicio => {
    const grupo = exercicio.grupoMuscular ? exercicio.grupoMuscular.toLowerCase() : 'desconhecido';
    gruposMuscularesCount[grupo] = (gruposMuscularesCount[grupo] || 0) + 1;
  });

  const barChartLabels = Object.keys(gruposMuscularesCount);
  const barChartValues = Object.values(gruposMuscularesCount);

  const barChartData = {
    labels: barChartLabels.length > 0 ? barChartLabels : ['Sem Dados'],
    datasets: [
      {
        data: barChartValues.length > 0 ? barChartValues : [1],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
      },
    ],
  };

  const pieChartData = barChartLabels.map((grupo, index) => ({
    name: grupo,
    population: barChartValues[index],
    color: `hsl(${index * 137 % 360}, 70%, 50%)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));


  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Dashboard de Exercícios
      </Text>
      
      {/* Button to manually trigger the API call for debugging */}
      <View style={styles.buttonContainer}>
        <Button 
          title="Test Backend Connection" 
          onPress={fetchHelloMessage} 
          color="#350075" // A nice purple to match your chart colors
        />
      </View>

      <Text style={styles.chartSubtitle}>
        Exercícios por Grupo Muscular (Gráfico de Barras)
      </Text>
      <BarChart
        data={barChartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        showBarTops={true}
        showValuesOnTopOfBars={true}
        style={styles.chartStyle} yAxisLabel={''} yAxisSuffix={''}         />

      <Text style={styles.chartSubtitle}>
        Exercícios por Grupo Muscular (Gráfico de Pizza)
      </Text>
      {pieChartData.length > 0 ? (
          <PieChart
            data={pieChartData} 
            width={screenWidth - 32}
            height={240}
            chartConfig={chartConfig} 
            accessor={"population"} 
            backgroundColor={"transparent"} 
            paddingLeft={"15"} 
            center={[screenWidth / 50, 0]} 
            absolute 
            hasLegend={true} 
            style={styles.chartStyle}
          />
      ) : (
          <Text style={styles.noDataText}>Nenhum dado de exercício disponível para o gráfico de pizza.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden', // Ensures the button background respects borderRadius
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20, 
    marginBottom: 10,
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white', 
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

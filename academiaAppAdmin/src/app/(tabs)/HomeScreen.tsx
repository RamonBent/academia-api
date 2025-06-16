import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { BarChart, PieChart } from 'react-native-chart-kit'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const EXERCICIO_STORAGE_KEY = '@myApp:exercicios';

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
                style={styles.chartStyle}
            />

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
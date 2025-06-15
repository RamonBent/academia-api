import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-chart-kit'; 

const screenWidth = Dimensions.get('window').width;

const rawStudentData = [
  { status: 'Matriculados', value: 400, color: '#1ABC9C' }, 
  { status: 'N/Matriculados', value: 100, color: '#E74C3C' }, 
];

const barChartData = {
  labels: rawStudentData.map(item => item.status),
  datasets: [
    {
      data: rawStudentData.map(item => item.value),
    },
  ],
};

const pieChartData = rawStudentData.map(item => ({
  name: item.status,
  population: item.value,
  color: item.color,
  legendFontColor: '#7F7F7F',
  legendFontSize: 15,
}));

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
    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Dashboard
            </Text>
            
            <Text style={styles.chartSubtitle}>
                Gráfico de Colunas Simples
            </Text>
            <BarChart
                data={barChartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showBarTops={true}
                showValuesOnTopOfBars={true} // Se o valor aparece no topo
                style={styles.chartStyle} yAxisLabel={''} yAxisSuffix={''}            />

            <Text style={styles.chartSubtitle}>
                Gráfico de Pizza
            </Text>
            <PieChart
                data={pieChartData} 
                width={screenWidth - 32}
                height={240}
                chartConfig={chartConfig}
                accessor={"population"} 
                backgroundColor={"transparent"} 
                paddingLeft={"-10"} 
                center={[screenWidth / 20 - 15, 0]}
                absolute
                style={styles.chartStyle}
            />
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
    marginTop: 20, // Aumenta a margem superior para separar os gráficos
    marginBottom: 10,
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white', 
    paddingVertical: 10,
    // Adicionado sombra para um visual melhor
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

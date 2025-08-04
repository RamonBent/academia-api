import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const INSTRUTORES_STORAGE_KEY = '@instrutores';

export async function fetchAndStoreInstrutores() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/instrutores`);
    const instrutores = response.data;
    await AsyncStorage.setItem(INSTRUTORES_STORAGE_KEY, JSON.stringify(instrutores));
    console.log('Instrutores successfully fetched and stored locally.');
    return instrutores;
  } catch (error) {
    console.error('Failed to fetch and store instrutores:', error);
    return null;
  }
}

export async function getStoredInstrutores() {
  try {
    const storedInstrutores = await AsyncStorage.getItem(INSTRUTORES_STORAGE_KEY);
    if (storedInstrutores) {
      return JSON.parse(storedInstrutores);
    }
    return [];
  } catch (error) {
    console.error('Failed to get stored instrutores:', error);
    return [];
  }
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const TREINOS_STORAGE_KEY = '@treinos';

export async function fetchAndStoreTreinos() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/treinos`);
    const treinos = response.data;
    await AsyncStorage.setItem(TREINOS_STORAGE_KEY, JSON.stringify(treinos));
    console.log('Treinos successfully fetched and stored locally.');
    return treinos;
  } catch (error) {
    console.error('Failed to fetch and store treinos:', error);
    return null;
  }
}

export async function getStoredTreinos() {
  try {
    const storedTreinos = await AsyncStorage.getItem(TREINOS_STORAGE_KEY);
    if (storedTreinos) {
      return JSON.parse(storedTreinos);
    }
    return [];
  } catch (error) {
    console.error('Failed to get stored treinos:', error);
    return [];
  }
}
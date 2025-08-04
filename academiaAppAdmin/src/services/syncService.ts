import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const OFFLINE_DATA_KEY = '@AcademiaApp:OfflineData';

export const saveOfflineData = async (data: any, collection: string) => {
  try {
    const existingData = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
    const parsedData = existingData ? JSON.parse(existingData) : {};
    
    if (!parsedData[collection]) {
      parsedData[collection] = [];
    }
    
    parsedData[collection].push({
      ...data,
      isSynced: false,
      createdAt: new Date().toISOString()
    });
    
    await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(parsedData));
    return true;
  } catch (error) {
    console.error('Error saving offline data:', error);
    return false;
  }
};

export const syncOfflineData = async () => {
  try {
    const existingData = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
    if (!existingData) return;

    const parsedData = JSON.parse(existingData);
    let hasChanges = false;

    for (const collection in parsedData) {
      const items = parsedData[collection];
      const unsyncedItems = items.filter((item: any) => !item.isSynced);

      for (const item of unsyncedItems) {
        try {
          const { isSynced, createdAt, ...dataToSend } = item;
          
          await axios.post(`${API_BASE_URL}/api/${collection}`, dataToSend);
          item.isSynced = true;
          hasChanges = true;
        } catch (error) {
          console.error(`Error syncing ${collection} item:`, error);
        }
      }
    }

    if (hasChanges) {
      await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(parsedData));
    }
  } catch (error) {
    console.error('Error syncing offline data:', error);
  }
};
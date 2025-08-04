import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncOfflineData } from '../services/syncService';

const NetworkSyncHandler = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncOfflineData();
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default NetworkSyncHandler;
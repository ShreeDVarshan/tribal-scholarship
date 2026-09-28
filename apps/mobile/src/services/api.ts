import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return config;
});

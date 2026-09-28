import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

interface User {
  id: string;
  name: string;
  mobile: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  loginWithOTP: (mobile: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  checkSession: async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      const userStr = await AsyncStorage.getItem('user_info');
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isLoading: false });
        return;
      }
    } catch (e) {}
    set({ isLoading: false });
  },

  loginWithOTP: async (mobile: string, otp: string) => {
    try {
      // Demo fallback check
      if (mobile === '9999999999' && otp === '123456') {
        const demoUser = { id: 'arjun-demo-id', name: 'Arjun Kumar', mobile: '9999999999', role: 'STUDENT' };
        const demoToken = 'demo-jwt-token-arjun';
        await AsyncStorage.setItem('user_token', demoToken);
        await AsyncStorage.setItem('user_info', JSON.stringify(demoUser));
        set({ user: demoUser, token: demoToken });
        return true;
      }

      const res = await apiClient.post('/auth/verify-otp', { mobile, otp });
      if (res.data.success) {
        const { user, accessToken } = res.data.data;
        await AsyncStorage.setItem('user_token', accessToken);
        await AsyncStorage.setItem('user_info', JSON.stringify(user));
        set({ user, token: accessToken });
        return true;
      }
      return false;
    } catch (e) {
      console.warn('API login failed, checking demo fallback', e);
      if (mobile === '9999999999' && otp === '123456') {
        const demoUser = { id: 'arjun-demo-id', name: 'Arjun Kumar', mobile: '9999999999', role: 'STUDENT' };
        set({ user: demoUser, token: 'demo-jwt-token-arjun' });
        return true;
      }
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_info');
    set({ user: null, token: null });
  },
}));

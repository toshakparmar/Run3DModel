import { create } from 'zustand';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/auth/login`, { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false
      });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/auth/register`, { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false
      });
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;

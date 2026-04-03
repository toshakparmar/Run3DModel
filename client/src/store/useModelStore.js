import { create } from 'zustand';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000";

const useModelStore = create((set, get) => ({
  models: [],
  currentModel: null,
  isLoading: false,
  error: null,

  fetchModels: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${SERVER_URL}/api/models`, config);
      set({ models: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  uploadModel: async (file, name, token) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('modelFile', file);
      if (name) formData.append('name', name);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      const { data } = await axios.post(`${SERVER_URL}/api/models`, formData, config);
      set((state) => ({ models: [data, ...state.models], isLoading: false }));
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchModelById: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${SERVER_URL}/api/models/${id}`, config);
      set({ currentModel: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateCameraState: async (id, cameraState, token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${SERVER_URL}/api/models/${id}`, { cameraState }, config);
      // Optimistic update
      set((state) => ({
        currentModel: state.currentModel ? { ...state.currentModel, cameraState } : null
      }));
    } catch (error) {
      console.error('Failed to save camera state:', error);
    }
  },

  deleteModel: async (id, token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${SERVER_URL}/api/models/${id}`, config);
      set((state) => ({
        models: state.models.filter((model) => model._id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete model:', error);
      throw error;
    }
  }
}));

export default useModelStore;

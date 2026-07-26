import { create } from 'zustand';
import api from '../utils/api';

export const useRoomStore = create((set, get) => ({
  rooms: [],
  currentRoom: null,
  heroImages: [],
  isLoading: false,
  error: null,

  fetchRooms: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(`/rooms?${query}`);
      set({ rooms: data.rooms, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  fetchRoomById: async (id, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(`/rooms/${id}?${query}`);
      set({ currentRoom: data.room, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  fetchHeroImages: async () => {
    try {
      const { data } = await api.get('/hero');
      set({ heroImages: data.images });
    } catch (error) {
      console.error('Failed to fetch hero images:', error);
    }
  },
}));
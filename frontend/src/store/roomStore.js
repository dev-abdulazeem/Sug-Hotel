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

  // NEW: Remove a specific image from a room
  removeRoomImage: async (roomId, imageUrl) => {
    try {
      await api.delete(`/rooms/${roomId}/images`, { data: { imageUrl } });
      // Refresh current room if viewing it
      const { currentRoom } = get();
      if (currentRoom?.id === roomId) {
        set({
          currentRoom: {
            ...currentRoom,
            images: currentRoom.images.filter((img) => img !== imageUrl),
          },
        });
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove image',
      };
    }
  },
}));
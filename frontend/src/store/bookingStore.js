import { create } from 'zustand';
import api from '../utils/api';

export const useBookingStore = create((set, get) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/bookings', bookingData);
      set({ currentBooking: data.booking, isLoading: false });
      return { success: true, booking: data.booking };
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
      return { success: false, message: error.response?.data?.message };
    }
  },

  fetchMyBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/bookings/my-bookings');
      set({ bookings: data.bookings, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  checkout: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/bookings/${bookingId}/checkout`);
      set({ isLoading: false });
      return { success: true, message: data.message };
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
      return { success: false, message: error.response?.data?.message };
    }
  },

  cancelBooking: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/bookings/${bookingId}/cancel`);
      set({ isLoading: false });
      return { success: true, message: data.message };
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
      return { success: false, message: error.response?.data?.message };
    }
  },

  initPayment: async (bookingId) => {
    try {
      const { data } = await api.post('/payments/initialize', { bookingId });
      return { success: true, authorizationUrl: data.authorizationUrl };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  clearError: () => set({ error: null }),
}));
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { loginAxios } from '@api/http-commons';

const axios = loginAxios();
const useSearchStore = create((set) => ({
  searchResults: [],
  setSearchResults: (results) =>
    set((state) => ({
      searchResults: results
    })),
  isLoading: false,
  error: null,

  fetchSearchResults: async (keyword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/search?medicineName=${keyword}`);

      set({ searchResults: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return Promise.reject(error);
    }
  },

  clearSearchResults: () => set({ searchResults: [] }),
}));

export default useSearchStore;
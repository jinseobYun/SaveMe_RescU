import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Axios } from '@api/http-commons';

const axios = Axios();
const useSearchStore = create((set) => ({
  searchResults: [],
  setSearchResults: (results) =>
    set((state) => ({
      searchResults: results
    })),
  isLoading: false,
  error: null,

  fetchSearchResults: async (query) => {
    set({ isLoading: true, error: null });
    //TODO - 검색 api url 확인
    try {
      const response = await axios.get(`/api/search`, {
        params: { query }
      });

      set({ searchResults: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearSearchResults: () => set({ searchResults: [] }),
}));

export default useSearchStore;
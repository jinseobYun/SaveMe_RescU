import { create } from "zustand";
import { devtools } from "zustand/middleware";

const store = (set) => ({
  inputs: {},
  updateInputs: (newInputs) =>
    set((state) => {
      state.inputs = { ...state.inputs, ...newInputs };
    }),
  clearInputs: () => set({ inputs: [] }),
});
const useFormInputStore = create(
  import.meta.env.NODE_ENV === "production" ? store : devtools(store)
);

export default useFormInputStore;

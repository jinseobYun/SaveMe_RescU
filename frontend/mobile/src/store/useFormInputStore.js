import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const store = (set) => ({
  inputs: {},
  updateInputs: (newInputs) =>
    set((state) => ({
      inputs: { ...state.inputs, newInputs },
    })),
  clearInputs: () => set({ inputs: {} }), // 빈 객체로 수정
});

const useFormInputStore = create(
  import.meta.env.NODE_ENV === "production"
    ? persist(store, {
        name: "formStore",
        storage: localStorage, // 로컬 스토리지를 사용
      })
    : devtools(
        persist(store, {
          name: "formStore",
          storage: localStorage, // 로컬 스토리지를 사용
        })
      )
);

export default useFormInputStore;

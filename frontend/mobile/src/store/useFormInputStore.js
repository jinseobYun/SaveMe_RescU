import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";


const store = (set) => ({
  isFormEdit: true,
  changeFormRegister: () =>
    set((state) => ({
      isFormEdit: false,
    })),
  changeFormEdit: () =>
    set((state) => ({
      isFormEdit: true,
    })),
  inputs: {
  },
  updateInputs: (newInputs) =>
    set((state) => ({
      inputs: { ...state.inputs, ...newInputs },
    })),
  clearInputs: () => set({ inputs: {} }),

  //SECTION - 질병 인풋
  //id, name
  medCdisInputs: [
  ],
  addMedCdisInputs: (newInput) =>
    set((state) => ({
      medCdisInputs: [...state.medCdisInputs, newInput],
    })),
  setMedCdisInput: (userMedCdis) =>
    set((state) => ({
      medCdisInputs: [...userMedCdis]
    })),
  deleteMedCdisInput: (inputId) =>
    set((state) => ({
      medCdisInputs: state.medCdisInputs.filter((i) => i.id !== inputId),
    })),
  clearMedCdisInputs: () => set({ medCdisInputs: [] }),

  //SECTION - 약 인풋
  drugInputs: [

  ],
  addDrugInputs: (newInput) =>
    set((state) => ({
      drugInputs: [...state.drugInputs, newInput],
    })),
  setDrugInputs: (userDrugInfos) =>
    set((state) => ({
      drugInputs: [...userDrugInfos]
    })),
  deleteDrugInput: (inputId) =>
    set((state) => ({
      drugInputs: state.drugInputs.filter((i) => i.id !== inputId),
    })),

  clearDrugInputs: () => set({ drugInputs: [] }),

  clearAllInputs: () =>
    set((state) => ({
      inputs: {},
      medCdisInputs: [],
      drugInputs: [],
    }))

});

const useFormInputStore = create(
  import.meta.env.NODE_ENV === "production"
    ? persist(store, {
      name: "formStore",
    })
    : devtools(
      persist(store, {
        name: "formStore",
      })
    )
);

export default useFormInputStore;

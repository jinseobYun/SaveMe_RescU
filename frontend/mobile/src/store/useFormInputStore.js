import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const store = (set) => ({
  inputs: {
    bloodType1: "O",
    bloodType2: "RH+",
    otherInfo: "기타 특이사항 내용",
  },
  updateInputs: (newInputs) =>
    set((state) => ({
      inputs: { ...state.inputs, ...newInputs },
    })),
  clearInputs: () => set({ inputs: {} }),

  //SECTION - 질병 인풋
  medCdisInputs: [
    {
      cdInfoId: 1,
      cdName: "고혈압",
    },
    {
      cdInfoId: 2,
      cdName: "당뇨병",
    },
    {
      cdInfoId: 3,
      cdName: "천식",
    },
  ],
  addMedCdisInputs: (newInput) =>
    set((state) => ({
      medCdisInputs: [...state.medCdisInputs, newInput],
    })),
  deleteMedCdisInput: (inputId) =>
    set((state) => ({
      medCdisInputs: state.medCdisInputs.filter((i) => i.cdInfoId !== inputId),
    })),
  clearMedCdisInputs: () => set({ medCdisInputs: [] }),

  //SECTION - 약 인풋
  drugInputs: [
    {
      medicineId: 24,
      medicineName: "러츠날캡슐(탐스로신염산염)",
    },
    {
      medicineId: 25,
      medicineName: "세린드연고",
    },
    {
      medicineId: 74,
      medicineName: "하트만용액",
    },
  ],
  addDrugInputs: (newInput) =>
    set((state) => ({
      drugInputs: [...state.drugInputs, newInput],
    })),
  deleteDrugInput: (inputId) =>
    set((state) => ({
      drugInputs: state.drugInputs.filter((i) => i.medicineId !== inputId),
    })),
  clearDrugInputs: () => set({ drugInputs: [] }),
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

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import useFormInputStore from './useFormInputStore';

const store = (set) => ({
  userId: null,
  setUserId: (userData) => set({ userId: userData }),
  clearUserId: () => set({ userId: null }),

  userName: null,
  setUserName: (userData) => set({ userName: userData.userName }),
  clearUserName: () => set({ userName: null }),

  //TODO - 더미 데이터 지우기
  // userMedicalInfo: null,
  userMedicalInfo: {
    "medicalInformationId": 20,
    "bloodType1": "O",
    "bloodType2": "RH+",
    "otherInfo": "기타 특이사항 내용",
    "drugInfos": [
      {
        id: 24,
        name: "러츠날캡슐(탐스로신염산염)",
      },
      {
        id: 25,
        name: "세린드연고",
      },
      {
        id: 74,
        name: "하트만용액",
      },
    ],
    "medCdis": [
      {
        id: 1,
        name: "고혈압",
      },
      {
        id: 2,
        name: "당뇨병",
      },
      {
        id: 3,
        name: "천식",
      },
    ]
  },
  setUserMedicalInfo: (userData) => {
    set({ userMedicalInfo: userData });

    const { setMedCdisInput, setDrugInputs } = useFormInputStore.getState();

    setMedCdisInput(userData.medCdis);
    setDrugInputs(userData.drugInfos);
  },
  clearUserMedicalInfo: () => set({ userMedicalInfo: null }),

  isLogined: false,
  login: () => set({ isLogined: true }),
  logout: () => set({ isLogined: false, userId: null, userMedicalInfo: null }),

  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),

  refreshToken: null,
  setReFreshToken: (token) => set({ refreshToken: token }),
  clearreFreshToken: () => set({ refreshToken: null }),
});

const useUserStore = create(
  import.meta.env.NODE_ENV === "production"
    ? persist(store, {
      name: "userStore",
    })
    : devtools(
      persist(store, {
        name: "userStore",
      })
    )
);

export default useUserStore;

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import useFormInputStore from "./useFormInputStore";

const store = (set) => ({
  userId: null,
  setUserId: (userData) => set({ userId: userData }),
  clearUserId: () => set({ userId: null }),

  userName: null,
  setUserName: (userData) => set({ userName: userData }),
  clearUserName: () => set({ userName: null }),

  gps: null,
  setGps: (userData) => set({ gps: userData }),
  clearGps: () => set({ gps: null }),
  gpsTermAgree: true,
  setGpsTermAgree: (agree) => set({ gpsTermAgree: agree }),
  clearGpsTermAgree: () => set({ gpsTermAgree: false }),

  tagId: null,
  setTagId: (userData) => set({ tagId: userData }),
  clearTagId: () => set({ tagId: null }),
  userMedicalInfo: null,
  setUserMedicalInfo: (userData) => {
    set({ userMedicalInfo: userData });

    const { updateInputs, setMedCdisInput, setDrugInputs } =
      useFormInputStore.getState();
    userData && updateInputs(userData);
    userData && setMedCdisInput(userData.medCdis);
    userData && setDrugInputs(userData.drugInfos);
  },
  clearUserMedicalInfo: () => set({ userMedicalInfo: null }),

  emergencyContactList: [],
  setEmergencyContactList: (userData) => {
    set({ emergencyContactList: userData });
  },
  addEmergencyContact: (newContact) => {
    set((state) => ({
      emergencyContactList: [...state.emergencyContactList, newContact],
    }));
  },
  deleteEmergencyContact: (id) => {
    set((state) => ({
      emergencyContactList: state.emergencyContactList.filter(
        (contact) => contact.emergencyContactId !== id
      ),
    }));
  },
  clearEmergencyContactList: () => set({ emergencyContactList: [] }),

  isLogined: false,
  login: () => set({ isLogined: true }),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isLogined: false, userId: null, userMedicalInfo: null, userName: null, gpsTermAgree: false, accessToken: null, refreshToken: null, emergencyContactList: [] });
  },

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

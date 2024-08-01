import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const store = (set) => ({
  userId: null,
  setUserId: (userData) => set({ userId: userData }),
  clearUserId: () => set({ userId: null }),

  userName: null,
  setUserName: (userData) => set({ userName: userData.userName }),
  clearUserName: () => set({ userName: null }),

  userMedicalInfo: null,
  setUserMedicalInfo: (userData) => set({ userMedicalInfo: userData }),
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
      storage: localStorage,
    })
    : devtools(
      persist(store, {
        name: "userStore",
        storage: localStorage,
      })
    )
);

export default useUserStore;

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const store = (set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),

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
        storage: localStorage, // 로컬 스토리지를 사용
      })
    : devtools(
        persist(store, {
          name: "userStore",
          storage: localStorage, // 로컬 스토리지를 사용
        })
      )
);

export default useUserStore;

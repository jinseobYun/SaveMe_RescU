// import { create } from "zustand";
// import { persist, devtools } from "zustand/middleware";

// const store = (set) => ({
//   user: null,
//   setUser: (userData) => set({ user: userData }),
//   clearUser: () => set({ user: null }),

//   accessToken: null,
//   setAccessToken: (token) => set({ accessToken: token }),
//   clearAccessToken: () => set({ accessToken: null }),

//   refreshToken: null,
//   setReFreshToken: (token) => set({ refreshToken: token }),
//   clearreFreshToken: () => set({ refreshToken: null }),
// });
// const useUserStore = create(
//   import.meta.env.NODE_ENV === "production"
//     ? persist(store, { name: "userStore" })
//     : persist(devtools(store)),
//   {
//     name: "userStore", getStorage: () => localStorage,
//   }
// );

// export default useUserStore;

import create from 'zustand';
import { persist } from 'zustand/middleware';

// 상태 관리 정의
const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null }),

      refreshToken: null,
      setReFreshToken: (token) => set({ refreshToken: token }),
      clearreFreshToken: () => set({ refreshToken: null }),
    }),
    {
      name: 'user-storage', // 스토리지 항목의 이름
      getStorage: () => localStorage, // 기본 스토리지는 localStorage
    }
  )
);

export default useUserStore;

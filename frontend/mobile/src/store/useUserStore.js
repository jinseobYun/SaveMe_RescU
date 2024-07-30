import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const store = (set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
});
const useUserStore = create(
  import.meta.env.NODE_ENV === "production"
    ? persist(store, { name: "userStore" })
    : persist(devtools(store)),
  { name: "userStore" }
);

export default useUserStore;

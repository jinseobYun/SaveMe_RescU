import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const store = (set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),

  peerConnection: null,
  setPeerConnection: (peerConnection) => set({ peerConnection }),

  chatChannel: null,
  setChatChannel: (chatChannel) => set({ chatChannel }),

  localStream: null,
  setLocalStream: (localStream) => set({ localStream }),

  remoteStream: null,
  setRemoteStream: (remoteStream) => set({ remoteStream }),

  roomId: null,
  setRoomId: (roomId) => set({ roomId }),
});
const useSocketStore = create(
  import.meta.env.NODE_ENV === "production"
    ? persist(store, {
        name: "socketStore",
      })
    : devtools(
        persist(store, {
          name: "socketStore",
        })
      )
);

export default useSocketStore;

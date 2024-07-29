import { io } from "socket.io-client";
import { API } from "./api";

export const socket = (roomId) => {
  return io(`${API}${roomId}`, {});
};

import { io, Socket } from "socket.io-client";

// Backend is running on port 8080
const SOCKET_URL = "http://localhost:8080";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socket;
};

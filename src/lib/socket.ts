import { io, Socket } from "socket.io-client";

// Derive Socket URL dynamically based on environment configuration
const getSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  if (apiUrl.endsWith("/api")) {
    return apiUrl.slice(0, -4);
  }
  if (apiUrl.endsWith("/api/")) {
    return apiUrl.slice(0, -5);
  }
  return apiUrl;
};

const SOCKET_URL = getSocketUrl();

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

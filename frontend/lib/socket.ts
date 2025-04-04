"use client";

import { io } from "socket.io-client";

const socketUrl = "http://localhost:8080";

export const socket = io(socketUrl, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  timeout: 10000,
  transports: ["websocket"],
});


import { BaseUrl } from "./constant"

import io from "socket.io-client";

let socket;

export const createSocketConnection = () => {
  if (!socket) {
    socket = io(BaseUrl); //backend URL
  }
  return socket;
};
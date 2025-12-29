import { io } from "socket.io-client";
import { BaseUrl } from "./constant"

export const createSocketConnection = ()=>{
    return io(BaseUrl)
}
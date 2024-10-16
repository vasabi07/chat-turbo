import { Socket } from "socket.io";

export interface User {
    id: String;
    name: String;
    phone: String;
  }
  
  export interface CustomSocket extends Socket {
    user?: User;
  }
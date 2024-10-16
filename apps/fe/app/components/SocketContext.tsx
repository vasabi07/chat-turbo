"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface context {
  socket: Socket | null;
  setSocket: any;
}
const SocketContext = createContext<context | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const cookieString = document.cookie; // e.g., "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; otherCookie=value"
    const tokenCookie = cookieString
      .split("; ")
      .find((row) => row.startsWith("token="));
    const token = tokenCookie ? tokenCookie.split("=")[1] : "no token";

    const newSocket = io("http://localhost:8000", {
      auth: {
        //@ts-ignore
        token: token,
      },
    });
    

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

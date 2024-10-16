"use client";
import { useEffect, useState } from "react";
import { useSocket } from "./components/SocketContext";
import UsersList from "./components/UsersList";
import PersonalInfo from "./components/personalInfo";
import { useRecoilValue } from "recoil";
import { personalInfoAtom } from "./components/atoms";
interface User {
  id: string;
  name: string;
  phone: string;
}
export default function Home() {
  // const [currentUser,setCurrentUser] = useState<User>()
  const { socket } = useSocket();
  const personalInfo = useRecoilValue(personalInfoAtom);
  console.log("this message is from the recoil data query",personalInfo)
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("connection", () => {
      console.log("new user connected.");
    });
  }, [socket]);
  return (
    <div className="">
    </div>
  );
}

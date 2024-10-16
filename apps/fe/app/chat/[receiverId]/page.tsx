"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "../../components/SocketContext";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useRecoilValue } from "recoil";
import { personalInfoAtom } from "../../components/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

const Chat = () => {
  const [text, setText] = useState("");
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const { socket } = useSocket();
  const { receiverId } = useParams();
  const receiver = Array.isArray(receiverId) ? receiverId[0] : receiverId; // Ensure receiverId is a string
  const personalInfo = useRecoilValue(personalInfoAtom)
  const fetchChat = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/chat/recents",
        {
          senderId: personalInfo.id,
          receiverId: receiverId,
        },
        {
          withCredentials: true,
        }
      );
      setDisplayMessages(response.data.payload);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleSendMessage = () => {
    if (!socket || !personalInfo.id || !receiver) {
      console.error("Socket, personalInfo.id, or receiverId is missing");
      return;
    }

    const message = {
      id: uuidv4(),
      senderId: personalInfo.id,
      receiverId: receiver,
      text,
      timestamp: new Date().toISOString(),
    };

    socket.emit("message", message);
    setDisplayMessages((prevMessages) => [...prevMessages, message]);
    setText("");
  };

  useEffect(() => {
    fetchChat();
  }, [receiverId]);

  useEffect(() => {
    if (!socket) {
      return;
    }
  
    const handleMessage = (newMessage: Message) => {
      setDisplayMessages((prevMessages) => [...prevMessages, newMessage]);
    };
  
    socket.on("message", handleMessage);
  
    return () => {
      socket.off("message", handleMessage); // Clean up with the specific handler
    };
  }, [socket]);
  

  return (
    
    <div className=" w-full chat-container flex flex-col h-screen bg-slate-200 ">
      <ScrollArea className="h-screen  overflow-auto">
      <div className="message-box">
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.senderId === personalInfo.id ? "sent" : "received"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      </ScrollArea>
      <div className="flex ">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="p-4 "
        />
        <Button onClick={handleSendMessage} className="hover:bg-stone-300">
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;

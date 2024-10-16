import express from "express";
import http from "http";
import db from "@repo/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { ChatSchema, MessageSchema, SigninSchema, SignupSchema } from "./zod";
import { AuthMiddleware, SocketAuthMiddleware } from "./Middlewares";
import { CustomSocket } from "./types";
import { pub, sub } from "./redis";
import { connectKafka, producer } from "./kafka";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

connectKafka();

io.use(SocketAuthMiddleware);

io.on("connection", async (socket: CustomSocket) => {
  if (socket.user) {
    console.log("New connection from user:", socket.user.id);
    await sub.subscribe(`user:${socket.user?.id}`);
  } else {
    console.log("Connection without user");
  }

  socket.on("message", async (msg) => {
    const parsedMessageresult = MessageSchema.safeParse(msg);
    if (!parsedMessageresult.success) {
      return console.log("Wrong format for message");
    }
    const parsedMessage = parsedMessageresult.data;

    try {
      await producer.send({
        topic: "messages",
        messages: [{ value: JSON.stringify(parsedMessage) }],
      });
      console.log("Successfully pushed to Kafka queue");

      await pub.publish(
        `user:${parsedMessage.receiverId}`,
        JSON.stringify(parsedMessage)
      );
      console.log(`Message from user ${socket.user?.id}`, parsedMessage);
    } catch (error) {
      console.log("Error while sending message to Kafka", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected`, socket.user?.id);
  });
});

sub.on("message", async (channel, msg) => {
  const checkMessage = MessageSchema.safeParse(JSON.parse(msg));
  if (!checkMessage.success) {
    return console.log("Wrong format for message");
  }
  const parsedMessage = checkMessage.data;
  console.log("message has reached redis sub", parsedMessage);

  io.sockets.sockets.forEach((socket) => {
    const customSocket = socket as CustomSocket;
    if (customSocket.user?.id && channel === `user:${customSocket.user.id}`) {
      customSocket.emit("message", parsedMessage);
    }
  });
});

app.post("/signup", async (req, res) => {
  const result = SignupSchema.safeParse(req.body);
  if (!result.success) {
    console.log(result.error);
    return res.json("Valid inputs weren't provided");
  }
  try {
    const { name, phone, password } = result.data;
    const data = await db.user.create({
      data: {
        name,
        phone,
        password,
      },
    });
    res.status(201).json({ message: "User created successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error while creating user.");
  }
});

app.post("/signin", async (req, res) => {
  const result = SigninSchema.safeParse(req.body);
  if (!result.success) {
    console.log(result.error);
    return res.json("Valid inputs weren't provided");
  }
  try {
    const { phone, password } = result.data;
    const user = await db.user.findUnique({
      where: {
        phone,
      },
    });
    if (!user || user.password !== password) {
      return res.json("Invalid phone or password");
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token);
    res.status(200).json({ message: "Successfully signed in", token });
  } catch (error) {
    console.log(error);
  }
});

app.use(AuthMiddleware);

app.get("/allusers", async (req, res) => {
  try {
    const userData = await db.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
      },
    });
    return res.json({ message: "Here is the list of users", userData });
  } catch (error) {
    console.log("Error getting all users");
  }
});

app.get("/personalInfo", async (req, res) => {
  try {
    //@ts-ignore
    const user = req.user;
    const payload = {
      id: user.id,
      name: user.name,
      phone: user.phone,
    };
    res.status(200).json({ message: "Logged in user's info", payload });
  } catch (error) {
    console.log(error);
  }
});

app.post("/chat/recents", async (req, res) => {
  const result = ChatSchema.safeParse(req.body);
  if (!result.success) {
    return res.json("Wrong format");
  }
  const { senderId, receiverId } = result.data;
  try {
    const payload = await db.message.findMany({
      where: {
        OR: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
      orderBy: {
        timestamp: "asc",
      },
      take: 30,
    });
    return res.json({ message: "Latest 30 messages", payload });
  } catch (error) {
    console.log(error);
    return res.json("Error in getting the messages");
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

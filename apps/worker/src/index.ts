import express from "express";
import db from "@repo/db";
import cors from "cors";
import { consumer, kafkaConsumer } from "./kafka";
const app = express();
const PORT = 8001;
app.use(cors());
app.use(express.json());

kafkaConsumer();
const runConsumer = async () => {
  await consumer.subscribe({ topic: "messages", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) {
        return;
      }
      const parsedMessage = JSON.parse(message.value?.toString());

      console.log({
        message: `here is the recent message from ${parsedMessage.senderId} to ${parsedMessage.receiverId}: ${parsedMessage.text}`,
      });
      try {
        await db.message.create({
          data: {
            senderId: parsedMessage.senderId,
            receiverId: parsedMessage.receiverId,
            text: parsedMessage.text,
            timestamp: parsedMessage.timestamp,
          },
        });
      } catch (error) {
        console.log("error saving to db");
      }
    },
  });
};
runConsumer();
app.listen(PORT, () => {
  console.log(`worker is listening on port:${PORT}`);
});

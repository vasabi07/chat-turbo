import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "chat-app",
    brokers: ["localhost:9092"],
  });
export const producer = kafka.producer();
export const connectKafka = async () => {
    try {
      await producer.connect();
      console.log("Kafka producer successfully connected");
    } catch (error) {
      console.log("Error connecting to the Kafka producer");
    }
  };
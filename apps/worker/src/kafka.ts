import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "chat-app",
    brokers: ["localhost:9092"]
  })
export const consumer = kafka.consumer({groupId : "chat-consumer"});
export const kafkaConsumer =async ()=>{
    try {
        await consumer.connect();
        console.log("kafka consumer succesfully connected ")
    } catch (error) {
       console.log("error while connecting the kafka consumer")  
    }
}
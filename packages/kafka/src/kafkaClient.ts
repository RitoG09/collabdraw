import { Kafka, logLevel } from "kafkajs";
import { prismaClient } from "@repo/db/client";

const kafka = new Kafka({
  logLevel: logLevel.ERROR,
  clientId: "collabdraw-app",
  brokers: ["192.168.29.134:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });

export const connectKafkaProducer = async () => {
  await producer.connect();
  console.log("Kafka producer started ...");
};

export const produceMessage = async (topic: string, message: any) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

export const consumeMessages = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic: topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) {
        console.warn(`Received empty message on topic ${topic}`);
        return;
      }
      const data = JSON.parse(message.value.toString());
      console.log({
        partition,
        offset: message.offset,
        value: data,
      });

      await prismaClient.chat.create({
        data: {
          roomId: data.roomId,
          senderId: data.senderId,
          message: data.message,
          createdAt: new Date(data.createdAt),
        },
      });
    },
  });
};

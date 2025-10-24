import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  clientId: "collabdraw-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });

export const connectKafkaProducer = async () => {
  await producer.connect();
  console.log("Kafka producer started ...");
};

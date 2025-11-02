import express, { Express } from "express";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import roomRouter from "./routes/room.route.js";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("its working");
});

app.use("/user", userRouter);
app.use("/room", roomRouter);

// connectKafkaProducer().catch((err) => {
//   console.log("Something went wrong while connecting kafka.", err);
// });

// const topic = "chats";
// consumeMessages(topic).catch((err) => {
//   console.log("The Kafka Consume error", err);
// });

app.listen(3001, () => {
  console.log("Server is running");
});

app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;

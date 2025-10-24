import express, { Express } from "express";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import roomRouter from "./routes/room.route.js";
import { connectKafkaProducer } from "@repo/kafka/config";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("its working");
});

app.use("/user", userRouter);
app.use("/room", roomRouter);

connectKafkaProducer().catch((err) => {
  console.log("Something went wrong while connecting kafka.");
});

app.listen(3001, () => {
  console.log("Server is running");
});

export default app;

import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userR.js";
import restaurantRoute from "./routes/restaurantR.js";
import tableRouter from "./routes/tableR.js";
import dishRouter from "./routes/dishR.js";
import orderRouter from "./routes/orderR.js"
import cookieParser from "cookie-parser";
import cors from 'cors';

await mongoose
  .connect("mongodb+srv://dasamant:12345@cluster0.e3buqvm.mongodb.net/test")
  .then(() => console.log("DB coneccted"))
  .catch((err) => console.log("DB error", err));

const app = express();
const PORT = process.env.PORT || 3002;

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:3000/restaurant/',
      'http://localhost:3000/login',
    ],
  })
);
app.use(express.json());
app.use(cookieParser());


app.use("/auth", userRoute);
app.use("/restaurant", restaurantRoute);
app.use("/table", tableRouter);
app.use("/dish", dishRouter);
app.use("/order", orderRouter);

app.listen(PORT, () => {
  console.log(`server runing on PORT ${PORT}`);
});

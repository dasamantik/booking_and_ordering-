import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userR.js";
import restaurantRoute from "./routes/restaurantR.js";
import tableRouter from "./routes/tableR.js";
import dishRouter from "./routes/dishR.js";
import cookieParser from "cookie-parser";
await mongoose
  .connect("mongodb+srv://dasamant:12345@cluster0.e3buqvm.mongodb.net/test")
  .then(() => console.log("DB coneccted"))
  .catch((err) => console.log("DB error", err));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", userRoute);
app.use("/restaurant", restaurantRoute);
app.use("/table", tableRouter);
app.use("/dish", dishRouter);

app.listen(PORT, () => {
  console.log(`server runing on PORT ${PORT}`);
});

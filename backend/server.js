import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userR.js";
await mongoose
  .connect("mongodb+srv://dasamant:12345@cluster0.e3buqvm.mongodb.net/test")
  .then(() => console.log("DB coneccted"))
  .catch((err) => console.log("DB error", err));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", userRoute);

app.listen(PORT, () => {
  console.log(`server runing on PORT ${PORT}`);
});

import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userR.js";
import restaurantRoute from "./routes/restaurantR.js";
import tableRouter from "./routes/tableR.js";
import dishRouter from "./routes/dishR.js";
import orderRouter from "./routes/orderR.js"
import cookieParser from "cookie-parser";
import cors from "cors";

await mongoose
  .connect("mongodb+srv://dasamant:12345@cluster0.e3buqvm.mongodb.net/test")
  .then(() => console.log("DB coneccted"))
  .catch((err) => console.log("DB error", err));

const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,append,delete,entries,foreach,get,has,keys,set,values,Authorization,X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use("/auth", userRoute);
app.use("/restaurant", restaurantRoute);
app.use("/table", tableRouter);
app.use("/dish", dishRouter);
app.use("/order", orderRouter);

app.listen(PORT, () => {
  console.log(`server runing on PORT ${PORT}`);
});

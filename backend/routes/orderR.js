import express from "express";
import { verifyUser,verifyAdmin } from "../middleware/jwtVerify.js";
import * as orderController from "../controllers/OrderController.js"
const router = express.Router();

router.post("/one",verifyUser, orderController.makeOrder);

router.get("/many", verifyAdmin,orderController.getOrders);

export default router;
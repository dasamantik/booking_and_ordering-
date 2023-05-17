import express from "express";
import * as dishController from "../controllers/DishController.js";
import { verifyAdmin, verifyUser } from "../middleware/jwtVerify.js";
const router = express.Router();

router.get("/:id", dishController.getDish);

router.get("", dishController.getDishs);

router.delete("/delete/:id", verifyAdmin, dishController.deleteDish);

router.patch("/update/:id", verifyAdmin, dishController.updateDish);

router.post("/:id", verifyAdmin, dishController.createDish);

export default router;

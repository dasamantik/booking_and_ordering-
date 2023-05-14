import express from "express";
import * as dishController from "../controllers/DishController.js";
import { verifyAdmin } from "../middleware/jwtVerify.js";
const router = express.Router();
//get getDish
router.get("/:id", dishController.getDish);
//get all DgetDishs
router.get("", dishController.getDishs);
//delete DgetDish
router.delete("/delete/:id", verifyAdmin, dishController.deleteDish);
//update DgetDish
router.patch("/update/:id", verifyAdmin, dishController.updateDish);
//create DgetDish
router.post("/:id", verifyAdmin, dishController.createDish);

export default router;

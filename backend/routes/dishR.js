import express from "express";
import * as dishController from "../controllers/DishController";
import { verifyAdmin } from "../middleware/jwtVerify.js";
const router = express.Router();
//get DgetDish
router.get("/:id", dishController.getDish);
//get all DgetDishs
router.get("", dishController.getDishs);
//delete DgetDish
router.delete("/delete/:id", verifyAdmin, dishController.deleteDish);
//update DgetDish
router.patch("/update/:id", verifyAdmin, dishController.updateDish);
//create DgetDish
router.post("/new", verifyAdmin, dishController.createDish);

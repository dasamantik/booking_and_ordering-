import express from "express";
import * as tableController from "../controllers/TableController.js";
import { verifyAdmin, verifyUser } from "../middleware/jwtVerify.js";

const router = express.Router();
//CREATE
router.post("/:id", verifyAdmin, tableController.createTable);

//UPDATE
router.patch("/availability/", verifyUser, tableController.updateTableAvailability);
router.patch("/mod/:id", verifyAdmin, tableController.updateTable);
//DELETE
router.delete("/:id", verifyAdmin, tableController.deleteTable);
//GET

router.get("/:id", tableController.getTable);
//GET ALL

router.get("/", tableController.getTables);

export default router;

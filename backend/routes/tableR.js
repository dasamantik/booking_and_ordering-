import express from "express";
import * as tableController from "../controllers/TableController.js";
import { verifyAdmin } from "../middleware/jwtVerify.js";

const router = express.Router();
//CREATE
router.post("/:id", verifyAdmin, tableController.createTable);

//UPDATE
router.put("/availability/:id", tableController.updateTableAvailability);
router.put("/mod/:id", verifyAdmin, tableController.updateTable);
//DELETE
router.delete("/:id/:hotelid", verifyAdmin, tableController.deleteTable);
//GET

router.get("/:id", tableController.getTable);
//GET ALL

router.get("/", tableController.getTables);

export default router;

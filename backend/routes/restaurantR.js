import express from "express";
import * as restaurantController from "../controllers/RestaurantController.js";
import { verifyAdmin } from "../middleware/jwtVerify.js";
const router = express.Router();
//get restaurant
router.get("/:id", restaurantController.getRestaurant);
//get all restaurants
router.get("", restaurantController.getRestaurants);
//delete restaurant
router.delete(
  "/delete/:id",
  verifyAdmin,
  restaurantController.deleteRestaurant
);
//update restaurant
router.patch("/update/:id", verifyAdmin, restaurantController.updateRestaurant);
//create restaurant
router.post("/new", verifyAdmin, restaurantController.createRestaurant);

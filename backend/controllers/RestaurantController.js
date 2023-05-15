import { validationResult } from "express-validator";
import Restaurant from "../models/RestauranntModel.js";

export const createRestaurant = async (reg, res) => {
  try {
    const errors = validationResult(reg.body);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const newRestaurant = await new Restaurant(reg.body).save();
    return res.status(200).json(newRestaurant);
  } catch {}
};

export const updateRestaurant = async (reg, res) => {
  try {
    const updatedRestourant = await Restaurant.findByIdAndUpdate(
      reg.params.id,
      { $set: reg.body },
      { new: true }
    );
    return res.status(200).json(updatedRestaurant);
  } catch {}
};

export const deleteRestaurant = async (reg, res) => {
  try {
    await Restaurant.findByIdAndDelete(reg.params.id);
    return res.status(200);
  } catch {}
};

export const getRestaurant = async (reg, res) => {
  try {
    const restaurant = await Restaurant.findById(reg.params.id);
    res.json(restaurant);
  } catch (err) {
    console.log(err);
  }
};

export const getRestaurants = async (reg, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch {}
};

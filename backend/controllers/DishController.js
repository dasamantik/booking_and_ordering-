import Dish from "../models/DishModel.js";
import Restaurant from "../models/RestauranntModel.js";


export const createDish = async (req, res, next) => {
  const restauranId = req.params.id;
  const newDish = new Dish(req.body);

  try {
    const savedDish = await newDish.save();
    try {
      await Restaurant.findByIdAndUpdate(restauranId, {
        $push: { dishes: savedDish._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedDish);
  } catch (err) {
    next(err);
  }
};

export const updateDish = async (req, res, next) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedDish);
  } catch (err) {
    next(err);
  }
};

export const deleteDish = async (req, res, next) => {
  const restauranId = req.body.id;
  try {
    await Dish.findByIdAndDelete(req.params.id);
    try {
      await Restaurant.findByIdAndUpdate(restauranId, {
        $pull: { dishes: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Dish has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getDish = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);
    res.status(200).json(dish);
  } catch (err) {
    next(err);
  }
};
export const getDishs = async (req, res, next) => {
  try {
    const Dishs = await Dish.find();
    res.status(200).json(Dishs);
  } catch (err) {
    next(err);
  }
};


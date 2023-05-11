import mongoose from "mongoose";

const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Dish", dishSchema);

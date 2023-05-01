import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  isReserved: {
    type: Boolean,
    default: false,
  },
});

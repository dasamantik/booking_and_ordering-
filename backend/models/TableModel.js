import mongoose from "mongoose";

const TableSchema = new mongoose.Schema(
  {
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
    roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
  },
  { timestamps: true }
);

export default mongoose.model("Table", TableSchema);

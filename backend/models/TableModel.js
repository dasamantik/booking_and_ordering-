import mongoose from "mongoose";

const TableSchema = new mongoose.Schema(
  {
    capacity: {
      type: Number,
      required: true,
    },
    isReserved: {
      type: Boolean,
      default: false,
    },
    tableNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
  },
  { timestamps: true }
);

export default mongoose.model("Table", TableSchema);

import Table from "../models/TableModel.js";
import Restauran from "../models/RestauranntModel.js";

export const createTable = async (req, res, next) => {
  const restauranId = req.params.id;
  const newTable = new Table(req.body);

  try {
    const savedTable = await newTable.save();
    try {
      await Restauran.findByIdAndUpdate(restauranId, {
        $push: { tables: savedTable._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedTable);
  } catch (err) {
    next(err);
  }
};

export const updateTable = async (req, res, next) => {
  try {
    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTable);
  } catch (err) {
    next(err);
  }
};
export const updateTableAvailability = async (req, res, next) => {
  try {
    await Table.updateOne(
      { "TableNumbers._id": req.params.id },
      {
        $push: {
          "TableNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Table status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const deleteTable = async (req, res, next) => {
  const restauranId = req.params.restauranid;
  try {
    await Table.findByIdAndDelete(req.params.id);
    try {
      await Restauran.findByIdAndUpdate(restauranId, {
        $pull: { Tables: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Table has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getTable = async (req, res, next) => {
  try {
    const Table = await Table.findById(req.params.id);
    res.status(200).json(Table);
  } catch (err) {
    next(err);
  }
};
export const getTables = async (req, res, next) => {
  try {
    const Tables = await Table.find();
    res.status(200).json(Tables);
  } catch (err) {
    next(err);
  }
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/UserModel.js";

export const register = async (reg, res) => {
  try {
    const errors = validationResult(reg.body);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const email = reg.body.email;
    const name = reg.body.name;
    const phone = reg.body.phone;
    const InUse = await User.findOne({ email });
    if (InUse) return res.status(400).json({ message: "Email olready exist" });
    const password = reg.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new User({
      email,
      passwordHash,
      phone,
      name,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося зареєструватися",
    });
  }
};

export const login = async (reg, res) => {
  try {
    const user = await User.findOne({ email: reg.body.email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Перевірте чи коректно введені данні" });
    const IsPasswordCor = await bcrypt.compare(
      reg.body.password,
      user._doc.passwordHash
    );
    if (!IsPasswordCor)
      res.status(400).json({ message: "Перевірте чи коректно введені данні" });

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    res
      .cookie("access_token", token, {
        httpOnly: false,
      })
      .status(200)
      .json({
        message: "OK",
      });
  } catch (err) {
    res.status(500).json({
      message: "Не вдалося увійти",
    });
    console.log(err);
  }
};

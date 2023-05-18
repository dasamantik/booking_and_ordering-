import express from "express";
import * as User from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", User.register);
router.post("/login", User.login);
router.post("/logout", User.logout);

export default router;

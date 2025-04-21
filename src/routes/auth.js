const express = require("express");
const { validateSignUp, validateLogin } = require("../utils/validator");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    validateSignUp(req);
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userToCreate = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const user = new User({ ...userToCreate });
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Either email or password is incorrect!");
    }
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new Error("Either email or password is incorrect!");
    }
    // Save token into cookie
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.status(200).send("Login successful!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { authRouter };

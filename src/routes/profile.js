const express = require("express");
const { useAuth } = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", useAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { profileRouter };

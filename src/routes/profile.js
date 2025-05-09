const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validator");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowed = validateEditProfile(req);
    if (!isAllowed) {
      throw new Error("Invalid fields");
    }

    const user = req.user;

    for (const field in req.body) {
      user[field] = req.body[field];
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(400).jsonp({ message: error.message });
  }
});

module.exports = { profileRouter };

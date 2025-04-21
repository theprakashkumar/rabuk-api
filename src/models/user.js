const { isStrongPassword } = require("validator");
const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [30, "First name cannot exceed 30 characters"],
    },
    lastName: { type: String, minLength: 3, maxLength: 30 },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    age: { type: Number, min: 18, max: 200 },
    gender: { type: String, enum: ["male", "female", "other"] },
    photoUrl: { type: String },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.verifyPassword = async function (password) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(password, user.password);

  return isPasswordValid;
};

const User = model("User", userSchema);

module.exports = { User };

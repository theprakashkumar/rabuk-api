import { isStrongPassword } from "validator";
import { Schema, model } from "mongoose";

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
      validate(value: string) {
        if (!isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    age: { type: Number, min: 18, max: 200 },
    gender: { type: String, enum: ["male", "female", "other"] },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);

import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 30 },
  lastName: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, maxlength: 1024 },
  age: { type: Number, required: true, min: 18, max: 2300 },
  gender: { type: String, required: true, enum: ["male", "female", "other"] },
});

export const User = model("User", userSchema);

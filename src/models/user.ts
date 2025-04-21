import { isStrongPassword } from "validator";
import { Schema, model, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the interface for User document
export interface IUser extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
  gender?: "male" | "female" | "other";
  skills?: string[];
  getJWT(): Promise<string>;
  verifyPassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
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

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return token;
};

userSchema.methods.verifyPassword = async function (password: string) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(password, user.password);

  return isPasswordValid;
};

export const User = model<IUser>("User", userSchema);

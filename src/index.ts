import express, { Express, Request, Response } from "express";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import { User } from "./models/user";
import { validateLogin, validateSignUp } from "./utils/validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { useAuth } from "./middleware/auth";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies in the request
app.use(express.json());
// Middleware to parse cookies in the request
app.use(cookieParser());

app.post("/signup", async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    validateLogin(req);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Either email or password is incorrect!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Either email or password is incorrect!");
    }
    // Save token into cookie
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
    res.cookie("token", token);
    res.status(200).send("Login successful!");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

app.get("/profile", useAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    res.status(200).send(user);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});
const startServer = async () => {
  try {
    // Connect to DB and then start the server.
    await connectDB();
    app.listen(port, () => {
      console.log(`⚡️Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

startServer();

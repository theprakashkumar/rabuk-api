import express, { Express, Request, Response } from "express";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import { User } from "./models/user";
import { Error } from "mongoose";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.post("/user", async (req: Request, res: Response) => {
  try {
    const user = new User({
      firstName: "Prakash",
      lastName: "Kumar",
      email: "maiprakshkumar@gmail.com",
      password: "123",
      age: 27,
      gender: "male",
    });
    const newUser = await user.save();
    console.log(newUser);
    res.send("New User is Created!");
  } catch (error: any) {
    console.error(error);
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

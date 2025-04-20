import express, { Express, Request, Response } from "express";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import { User } from "./models/user";
import { validateSignUp } from "./utils/validator";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies in the request
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  try {
    validateSignUp(req);
    const userToCreate = req.body;
    // hash the password
    const user = new User(userToCreate);
    const newUser = await user.save();
    res.status(201).send(newUser);
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

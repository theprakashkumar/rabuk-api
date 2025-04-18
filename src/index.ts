import express, { Express } from "express";
import { connectDB } from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

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

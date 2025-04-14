import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Rabuk API" });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️Server is running at http://localhost:${port}`);
});

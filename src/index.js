const express = require("express");
const { connectDB } = require("./config/database");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies in the request
app.use(express.json());
// Middleware to parse cookies in the request
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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

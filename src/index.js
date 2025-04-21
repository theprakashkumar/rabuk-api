const express = require("express");
const { connectDB } = require("./config/database");
const dotenv = require("dotenv");
const { User } = require("./models/user");
const { validateLogin, validateSignUp } = require("./utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { useAuth } = require("./middleware/auth");

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies in the request
app.use(express.json());
// Middleware to parse cookies in the request
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Either email or password is incorrect!");
    }
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new Error("Either email or password is incorrect!");
    }
    // Save token into cookie
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.status(200).send("Login successful!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/profile", useAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
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

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const userModel=require('./models/UserModel')
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/chillTimes");

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.post("/chillTimes/signup", async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      userName: userName,
      email: email,
      password: hashedPassword,
    });
    console.log("User created:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/chillTimes/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return req.status(400).json({ error: "no user exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return req.status(400).json({ error: "password wrong" });
    }

    res.status(200).json({ message: "login success" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

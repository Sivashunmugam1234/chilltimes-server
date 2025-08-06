const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const userModel=require('./models/UserModel')
const app = express();
const PORT = process.env.PORT || 3000;
const jwt=require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

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
   
    
    const payload = {
      userId: user.id,
      username: user.userName, 
      email: user.email
    };
    const token=jwt.sign(payload,SECRET_KEY,{
      expiresIn:'48h'
    });
       res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.userName,
        email: user.email
      }
    });
    // res.status(200).json({ message: "login success" });
  } catch {
    
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

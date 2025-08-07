const userModel = require("../../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

exports.signup = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      userName,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "No user exists" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const payload = {
      userId: user.id,
      username: user.userName,
      email: user.email,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "48h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

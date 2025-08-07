const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./auth/authRoutes/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/chillTimes", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

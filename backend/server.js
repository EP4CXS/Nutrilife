const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4028"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "nutrilife-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`NutriLife backend listening on port ${PORT}`);
});
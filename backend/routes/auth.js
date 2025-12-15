const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// Helper to run a query with Promise
function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "email, username, and password are required" });
  }

  try {
    const existing = await query(
      "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email or username already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
      [email, username, passwordHash]
    );

    const userId = result.insertId;

    // Use default role "user" without inserting into user_roles
    const token = jwt.sign(
      { id: userId, email, username, roles: ["user"] },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(201).json({
      token,
      user: { id: userId, email, username, roles: ["user"] },
      message: `Welcome ${username}`,
      isNewUser: true,
    });
  } catch (err) {
    console.error("Signup error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: "emailOrUsername and password are required" });
  }

  try {
    const users = await query(
      "SELECT u.id, u.email, u.username, u.password_hash FROM users u WHERE u.email = ? OR u.username = ? LIMIT 1",
      [emailOrUsername, emailOrUsername]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Use default role "user" without querying user_roles
    const roles = ["user"];

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, roles },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username, roles },
      message: `Welcome back ${user.username}`,
      isNewUser: false,
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/logout - stateless JWT, just respond OK
router.post("/logout", (req, res) => {
  return res.json({ message: "Logged out" });
});

module.exports = router;

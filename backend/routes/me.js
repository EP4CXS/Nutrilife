const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// GET /api/me/profile
router.get("/profile", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const rows = await query(
      "SELECT u.id, u.email, u.username, p.full_name, p.age, p.gender, p.height_cm, p.current_weight_kg, p.target_weight_kg, p.activity_level, p.health_goals, p.dietary_preferences, p.budget_settings FROM users u LEFT JOIN user_profiles p ON u.id = p.user_id WHERE u.id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = rows[0];
    res.json(profile);
  } catch (err) {
    console.error("Get profile error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/me/profile
router.put("/profile", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const {
    full_name,
    age,
    gender,
    height_cm,
    current_weight_kg,
    target_weight_kg,
    activity_level,
    health_goals,
    dietary_preferences,
    budget_settings,
  } = req.body;

  try {
    const existing = await query("SELECT id FROM user_profiles WHERE user_id = ?", [userId]);

    const payload = {
      full_name: full_name || null,
      age: age || null,
      gender: gender || null,
      height_cm: height_cm || null,
      current_weight_kg: current_weight_kg || null,
      target_weight_kg: target_weight_kg || null,
      activity_level: activity_level || null,
      health_goals: health_goals || null,
      dietary_preferences: dietary_preferences ? JSON.stringify(dietary_preferences) : null,
      budget_settings: budget_settings ? JSON.stringify(budget_settings) : null,
    };

    if (existing.length === 0) {
      await query(
        "INSERT INTO user_profiles (user_id, full_name, age, gender, height_cm, current_weight_kg, target_weight_kg, activity_level, health_goals, dietary_preferences, budget_settings) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          payload.full_name,
          payload.age,
          payload.gender,
          payload.height_cm,
          payload.current_weight_kg,
          payload.target_weight_kg,
          payload.activity_level,
          payload.health_goals,
          payload.dietary_preferences,
          payload.budget_settings,
        ]
      );
    } else {
      await query(
        "UPDATE user_profiles SET full_name = ?, age = ?, gender = ?, height_cm = ?, current_weight_kg = ?, target_weight_kg = ?, activity_level = ?, health_goals = ?, dietary_preferences = ?, budget_settings = ? WHERE user_id = ?",
        [
          payload.full_name,
          payload.age,
          payload.gender,
          payload.height_cm,
          payload.current_weight_kg,
          payload.target_weight_kg,
          payload.activity_level,
          payload.health_goals,
          payload.dietary_preferences,
          payload.budget_settings,
          userId,
        ]
      );
    }

    res.json({ message: "Profile saved" });
  } catch (err) {
    console.error("Update profile error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/me/dashboard - minimal example
router.get("/dashboard", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const [latestBmi] = await query(
      "SELECT * FROM bmi_records WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 1",
      [userId]
    );

    const mealsToday = await query(
      "SELECT * FROM meal_logs WHERE user_id = ? AND DATE(logged_at) = CURDATE() ORDER BY logged_at DESC",
      [userId]
    );

    const summary = await query(
      "SELECT * FROM calorie_summaries WHERE user_id = ? AND summary_date = CURDATE() LIMIT 1",
      [userId]
    );

    res.json({
      latestBmi: latestBmi || null,
      mealsToday,
      todaySummary: summary[0] || null,
    });
  } catch (err) {
    console.error("Dashboard error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

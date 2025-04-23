const express = require("express");
const router  = express.Router();
const User    = require("../db/User");

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match." });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ success: false, message: "Username already exists." });
    }

    user = new User({ username, password });
    await user.save();

    res.cookie("username", username, { httpOnly: true });
    res.status(201).json({ success: true, message: "Registered and logged in successfully.", username });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid username or password." });
    }

    res.cookie("username", username, { httpOnly: true });
    res.json({ success: true, message: "Login successful.", username });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.json({ success: true, message: "Logged out successfully." });
});

module.exports = router;

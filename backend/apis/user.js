

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

    req.session.user = { username };  // ✅ 替换 cookie 登录为 session 登录
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

    req.session.user = { username };  // ✅ 替换 cookie 登录为 session 登录
    res.json({ success: true, message: "Login successful.", username });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {                         // ✅ 清除 session
    res.clearCookie("connect.sid");                   // ✅ 删除 session cookie
    res.json({ success: true, message: "Logged out successfully." });
  });
});

// GET /api/user/me - 用于前端自动识别登录状态
router.get("/me", (req, res) => {
  if (req.session?.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: "Not logged in" });
  }
});


module.exports = router;

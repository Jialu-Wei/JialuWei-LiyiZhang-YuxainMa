const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const session = require("express-session");

connectDB();

const userRoutes   = require("./apis/user");
const gameRoutes   = require("./apis/game");
const scoresRoutes = require("./apis/scores");

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ 1. 一定要最早注册 cors
app.use(cors({
  origin: "https://battleship-fronted.onrender.com", // ✅ 确保拼写准确
  credentials: true
}));

// ✅ 2. 然后 json、cookie
app.use(express.json());
app.use(cookieParser());

// ✅ 3. 然后 session（cookie 依赖 cookieParser）
app.use(session({
  secret: "battleship-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "None",
    httpOnly: true
  }
}));

// ✅ 4. 最后注册路由
app.use("/api/user",   userRoutes);
app.use("/api/game",   gameRoutes);
app.use("/api/scores", scoresRoutes);

app.get("/", (req, res) => {
  res.send("🎯 Battleship backend is running!");
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

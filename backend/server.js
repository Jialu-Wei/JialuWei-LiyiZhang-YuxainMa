const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");

const userRoutes   = require("./apis/user");
const gameRoutes   = require("./apis/game");
const scoresRoutes = require("./apis/scores");

connectDB();
const app = express();
const PORT = process.env.PORT || 8000;

// ✅ 1. CORS 
app.use(cors({
  origin: "https://battleship-fronted.onrender.com",  
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// 3. Session 
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

app.use("/api/user",   userRoutes);
app.use("/api/game",   gameRoutes);
app.use("/api/scores", scoresRoutes);

app.get("/", (req, res) => {
  res.send("🎯 Battleship backend is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

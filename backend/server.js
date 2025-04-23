const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
connectDB();
const cookieParser = require("cookie-parser");

const userRoutes   = require("./apis/user");
const gameRoutes   = require("./apis/game");
const scoresRoutes = require("./apis/scores");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "https://battleship-fronted.onrender.com", 
  credentials: true,
}));

app.use("/api/user",   userRoutes);
app.use("/api/game",   gameRoutes);
app.use("/api/scores", scoresRoutes);

app.get("/", (req, res) => {
  res.send("🎯 Battleship backend is running!");
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

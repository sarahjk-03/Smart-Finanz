const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const authRoutes = require("./routes/auth");  
const authMiddleware = require("./middleware/authMiddleware");
const expenseRoutes = require("./routes/expenses");
const adminRoutes = require("./routes/admin");
const errorMiddleware = require("./middleware/errorMiddleware");
const rateLimit = require("express-rate-limit");

const app = express();

// === FIX: Trust Render proxy for rate-limit ===
app.set("trust proxy", 1);

// === CORS: Allow only your Vercel frontend ===
app.use(cors({
  origin: "https://your-vercel-link.vercel.app", // <- replace with your Vercel link
  credentials: true
}));

app.use(express.json());

// === Rate limiter ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// === Routes ===
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("SmartFinanz API is running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});

// === Error middleware ===
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
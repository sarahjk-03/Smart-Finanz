const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();
const pool = require("../db");

//  Income vs Expense Pie Chart
router.get("/income-expense",authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT type, SUM(amount) AS total
      FROM expenses
      WHERE user_id = $1
      GROUP BY type
      `,
      [userId]
    );

    let income = 0;
    let expense = 0;

    result.rows.forEach(row => {
      if (row.type === "income") income = Number(row.total);
      if (row.type === "expense") expense = Number(row.total);
    });

    res.json([
      { name: "Income", value: income },
      { name: "Expense", value: expense }
    ]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
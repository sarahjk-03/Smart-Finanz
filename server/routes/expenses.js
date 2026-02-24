const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ADD EXPENSE / INCOME
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, category, type, date } = req.body;
    const userId = req.user.userId;

    const newExpense = await pool.query(
      `INSERT INTO expenses 
       (user_id, amount, category, description, type, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, amount, category, null, type, date]
    );

    res.status(201).json(newExpense.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// GET ALL EXPENSES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const expenses = await pool.query(
      "SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC",
      [userId]
    );

    res.json(expenses.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE EXPENSE (User can delete their own)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedExpense = await pool.query(
      "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (deletedExpense.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// UPDATE EXPENSE
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user.userId;

    const { amount, category, description, type, date } = req.body;

    if (!amount || !type || !date) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const updatedExpense = await pool.query(
      `UPDATE expenses 
       SET amount = $1,
           category = $2,
           description = $3,
           type = $4,
           date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [amount, category, description || null, type, date, expenseId, userId]
    );

    if (updatedExpense.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      message: "Expense updated successfully",
      expense: updatedExpense.rows[0],
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DASHBOARD TOTALS
router.get("/dashboard/summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const totals = await pool.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses
      FROM expenses
      WHERE user_id = $1
      `,
      [userId]
    );

    const totalIncome = parseFloat(totals.rows[0].total_income);
    const totalExpenses = parseFloat(totals.rows[0].total_expenses);
    const balance = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      balance,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CATEGORY BREAKDOWN
router.get("/dashboard/categories", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT 
        category,
        SUM(amount) AS total
      FROM expenses
      WHERE user_id = $1
      GROUP BY category
      ORDER BY total DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// SEPARATE INCOME & EXPENSE CATEGORY BREAKDOWN (ONLY ONE VERSION)
router.get("/dashboard/categories/separate", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const incomeResult = await pool.query(
      `
      SELECT category, SUM(amount) AS total
      FROM expenses
      WHERE user_id = $1 AND type = 'income'
      GROUP BY category
      ORDER BY total DESC
      `,
      [userId]
    );

    const expenseResult = await pool.query(
      `
      SELECT category, SUM(amount) AS total
      FROM expenses
      WHERE user_id = $1 AND type = 'expense'
      GROUP BY category
      ORDER BY total DESC
      `,
      [userId]
    );

    res.json({
      income: incomeResult.rows,
      expense: expenseResult.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// MONTHLY SUMMARY
router.get("/dashboard/monthly", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT 
        TO_CHAR(date, 'YYYY-MM') AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
      FROM expenses
      WHERE user_id = $1
      GROUP BY month
      ORDER BY month ASC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

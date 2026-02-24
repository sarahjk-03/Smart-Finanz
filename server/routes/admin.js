const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// TEST ADMIN ROUTE
router.get("/test", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Welcome Admin 👑" });
});

module.exports = router;

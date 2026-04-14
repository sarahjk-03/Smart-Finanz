const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🚀 AUTH HEADER RECEIVED:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🚀 TOKEN EXTRACTED:", token);
    console.log("🔐 JWT_SECRET =", process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId: ... }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;



const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    try {
      // req.user comes from authMiddleware
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({
          message: "Access denied. Admins only."
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = roleMiddleware;

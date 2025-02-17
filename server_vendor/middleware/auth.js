// middleware/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (roles.length && !roles.includes(decoded.role)) return res.status(403).send("Forbidden");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};

module.exports = authMiddleware;

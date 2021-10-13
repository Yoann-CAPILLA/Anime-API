const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(400).json("No token");
  } else {
    try {
      const decoded = jwt.verify(token, SECRET);
      req.body.user_id = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ auth: false, message: "Authentication failed" });
    }
  }
};

module.exports = verifyJWT;

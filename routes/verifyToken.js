const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "sec2011", (err, user) => {
      // ✅ Use env variable
      if (err) res.status(403).json("Invalid token");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("Unauthenticated");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  // ✅ Fixed spelling
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Not authorized");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  // ✅ Fixed spelling
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Admin access required");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization, // ✅ Fixed
  verifyTokenAndAdmin, // ✅ Fixed
};

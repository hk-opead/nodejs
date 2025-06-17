const router = require("express").Router();
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const { User, Profile } = require("../model/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Sequelize automatically handles password encryption via hooks
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJs.AES.encrypt(req.body.password, "secretkey").toString(), // Will be encrypted by the beforeCreate hook
      isAdmin: req.body.isAdmin || false,
    });

    // Omit password from response
    const userResponse = user.get({ plain: true });
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({
      message: "Error registering user",
      error: err.errors ? err.errors.map((e) => e.message) : err.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
    });

    if (!user) {
      return res.status(401).json("Invalid credentials");
    }

    // Decrypt password
    const bytes = CryptoJs.AES.decrypt(user.password, "secretkey");
    const originalPassword = bytes.toString(CryptoJs.enc.Utf8);

    if (originalPassword !== req.body.password) {
      return res.status(401).json("Invalid credentials");
    }

    // Create JWT token
    const accessToken = jwt.sign(
      {
        id: user.id, // Sequelize uses 'id' instead of '_id'
        isAdmin: user.isAdmin,
      },
      "sec2011",
      { expiresIn: "3d" }
    );

    // Omit password from response
    const userResponse = user.get({ plain: true });
    delete userResponse.password;

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: accessToken,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error logging in",
      error: err.message,
    });
  }
});

module.exports = router;

const router = require("express").Router();
const User = require("../model/User").User;
const CryptoJs = require("crypto-js");
const { Op } = require("sequelize");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// UPDATE USER
router.put("/:id", verifyToken, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      "secretkey"
    ).toString();
  }

  try {
    const updatedUser = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true, // For PostgreSQL to return the updated record
      plain: true,
    });

    // For MySQL/SQLite, we need to fetch the updated user separately
    const user = await User.findByPk(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    console.log(user);
    if (user) {
      await User.destroy({
        where: { id: req.params.id },
      });
      res.status(200).json("delete success");
    }
    res.status(200).json("user not find ");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER BY ID
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: accestoken,
      // isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL USERS
router.get("/all", verifyTokenAndAdmin, async (req, res) => {
  console.log("1");
  try {
    const users = await User.findAll({ transaction: null });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
    console.log("Error fetching users:", err);
  }
});

// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.findAll({
      where: {
        createdAt: {
          [Op.gte]: lastYear,
        },
      },
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      group: [sequelize.fn("MONTH", sequelize.col("createdAt"))],
      raw: true,
    });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

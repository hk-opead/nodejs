const router = require("express").Router();
const multer = require("multer");

const Product = require("../model/User").Product;
const User = require("../model/User").User;
const CryptoJs = require("crypto-js");
const fs = require("fs");
const path = require("path");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
const imageDir = path.join(uploadDir, "images");
const fileDir = path.join(uploadDir, "files");
const galleryDir = path.join(uploadDir, "gallery");

[uploadDir, imageDir, fileDir, galleryDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadDir;
    if (file.fieldname === "img") {
      uploadPath = imageDir;
    } else if (file.fieldname === "file") {
      uploadPath = fileDir;
    } else if (file.fieldname === "gallery") {
      uploadPath = galleryDir;
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExt);
    // cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// const upload = require("../middleware/upload");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.post(
  "/",
  verifyTokenAndAdmin,
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "file", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  async (req, res, next) => {
    try {
      // Get paths for uploaded files
      const imagePath = req.files["img"]
        ? `/uploads/images/${req.files["img"][0].filename}`
        : null;
      const filePath = req.files["file"]
        ? `/uploads/files/${req.files["file"][0].filename}`
        : null;

      const imagePaths = req.files["gallery"]
        ? req.files["gallery"].map(
            (file) => `/uploads/gallery/${file.filename}`
          )
        : [];
      console.log(imagePaths);

      console.log("Image path:", imagePath);
      console.log("File imagePaths:", imagePaths);
      console.log("File path:", req.user);
      const newProduct = await Product.create({
        title: req.body.title,
        description: req.body.description,
        img: imagePath,
        gallery: imagePaths,
        file: filePath,
        category: req.body.category,
        size: req.body.size,
        price: req.body.price,
        color: req.body.color,
        user_id: req.user.id,
      });

      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Error creating product",
        details: err.message,
      });
    }
  }
);

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
      returning: true, // For PostgreSQL to return the updated record
      plain: true,
    });

    // For MySQL/SQLite, we need to fetch the updated user separately
    const product = await Product.findByPk(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    console.log(product);
    if (product) {
      await Product.destroy({
        where: { id: req.params.id },
      });
      res.status(200).json("delete success");
    }
    res.status(200).json("user not find ");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email"] },
      ],
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    const product = await Product.findAll({
      transaction: null,
      include: [{ model: User, as: "user", attributes: ["id", "username"] }],
    });
    res.status(200).json(product);
    console.log(product);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;

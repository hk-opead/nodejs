const router = require("express").Router();
const multer = require("multer");

const Book = require("../model/books").Book;
const fs = require("fs");
const path = require("path");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
const imageDir = path.join(uploadDir, "Bookimg");

[uploadDir, imageDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadDir;
    if (file.fieldname === "img") {
      uploadPath = imageDir;
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
  upload.fields([{ name: "img", maxCount: 1 }]),
  async (req, res, next) => {
    try {
      // Get paths for uploaded files
      const imagePath = req.files["img"]
        ? `/uploads/Bookimg/${req.files["img"][0].filename}`
        : null;

      const newBook = await Book.create({
        title: req.body.title,
        desc: req.body.description,
        details: req.body.details,
        img: imagePath,
        url: req.body.url,
      });

      res.status(201).json(newBook);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Error creating project",
        details: err.message,
      });
    }
  }
);

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedBook = await Book.update(req.body, {
      where: { id: req.params.id },
      returning: true, // For PostgreSQL to return the updated record
      plain: true,
    });

    // For MySQL/SQLite, we need to fetch the updated user separately
    const book = await Book.findByPk(req.params.id);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    console.log(book);
    if (book) {
      await Book.destroy({
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
    const book = await Book.findByPk(req.params.id);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    const book = await Book.findAll({
      transaction: null,
    });
    res.status(200).json(book);
    console.log(book);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;

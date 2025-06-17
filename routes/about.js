const router = require("express").Router();
const multer = require("multer");

const About = require("../model/about").About;
const fs = require("fs");
const path = require("path");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    // Get paths for uploaded files

    const newAbout = await About.create({
      title: req.body.title,
      desc: req.body.description,
      details: req.body.details,
      comunication: req.body.comunication,
      places: req.body.places,
    });

    res.status(201).json(newAbout);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Error creating project",
      details: err.message,
    });
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedAbout = await About.update(req.body, {
      where: { id: req.params.id },
      returning: true, // For PostgreSQL to return the updated record
      plain: true,
    });

    // For MySQL/SQLite, we need to fetch the updated user separately
    const about = await About.findByPk(req.params.id);
    res.status(200).json(about);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const about = await About.findByPk(req.params.id);
    console.log(about);
    if (about) {
      await about.destroy({
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
    const about = await About.findByPk(req.params.id);
    res.status(200).json(about);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    const about = await About.findAll({
      transaction: null,
    });
    res.status(200).json(about);
    console.log(about);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;

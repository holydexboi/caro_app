const express = require("express");
const auth = require("../middleware/auth");
const Category = require("../models/category");
const { v4 } = require("uuid");

const router = express.Router();

Category.createTable();

router.post("/create", auth, async (req, res) => {
  if (!req.body.name)
    return res.status(400).send("Category name is not define");

  const categoryId = v4();
  const name = req.body.name;

  Category.createCategory({ id: categoryId, name })
    .then((category) => {
      res.send("Category has been created successfully");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.get("/allcategories", async (req, res) => {
  Category.getAllCategory()
    .then((categories) => {
      res.send(categories);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.get("/getcategory/:id", async (req, res) => {
  Category.getCategoryById(req.params.id)
    .then((category) => {
      res.send(category);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.put("/editcategory/:id", async (req, res) => {

    if (!req.body.name)
    return res.status(400).send("Category name is not define");

    Category.editCategory(req.params.id, req.body.name)
      .then((category) => {
        res.send(category);
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  });

  module.exports = router
const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/product");
const { v4 } = require("uuid");

const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: "dyw9ms10v",
  api_key: "418922614784811",
  api_secret: "qZ3nprRSl6klmVJ5eG151M3g3rs",
});

const router = express.Router();

Product.createTable();

router.post("/create", auth, async (req, res) => {
  if (!req.body.name) return res.status(400).send("Product Name is not define");
  if (!req.body.description)
    return res.status(400).send("Product Description is not define");
  if (!req.body.price) return res.status(400).send("Price is not define");
  if (!req.body.image) return res.status(400).send("Image not define");
  if (!req.body.category) return res.status(400).send("Category not define");

  const productId = v4();
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const image = req.body.image;
  const category = req.body.category;
  const seller = req.user._id;

  Product.createProduct({
    id: productId,
    name,
    description,
    price,
    image,
    seller,
    category,
    review: 0.0,
    numberOfReview: 0,
  })
    .then((product) => {
      res.send("Product has been created successfully");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.post("/upload", upload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).send("No image selected");
  console.log(req.file);
  const resp = cloudinary.uploader.upload(req.file.path);

  resp
    .then((data) => {
      console.log(data);
      res.send(data.secure_url);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

router.get("/products", async (req, res) => {
  Product.getAllProducts()
    .then((products) => {
      res.send(products);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.get("/product/:id", async (req, res) => {
  Product.getSingleProduct(req.params.id)
    .then((product) => {
      res.send(product);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.get("/myproducts", auth, async (req, res) => {
  console.log(req.user._id);
  Product.getMyProducts(req.user._id)
    .then((product) => {
      res.send(product);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.put("/update/:id", auth, async (req, res) => {
  const name = req.body.name ? req.body.name : "";
  const description = req.body.description ? req.body.description : "";
  const price = req.body.price ? req.body.price : "";
  const image = req.body.image ? req.body.image : "";

  Product.editProduct(req.params.id, {
    name,
    description,
    price,
    image,
  })
    .then((product) => {
      res.send(product);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.put("/review/:id", auth, async (req, res) => {
  if (!req.body.review) return res.status(400).send("review not define");

  Product.editReview(req.params.id, req.body.review)
    .then((product) => {
      res.send('Review Updated');
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.delete("/delete/:id", auth, async (req, res) => {
  Product.deleteProduct(req.params.id)
    .then((product) => {
      res.send("Deleted Successfully");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

module.exports = router;

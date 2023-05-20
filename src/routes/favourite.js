const express = require("express");
const auth = require("../middleware/auth");
const Favourite = require("../models/favourite");
const { v4 } = require("uuid");

const router = express.Router();

Favourite.createTable();

router.post("/add", auth, (req, res) => {
  const favouriteId = v4();
  if (!req.body.product) return res.status(400).send("Product Id not define");

  Favourite.createFavourite({
    id: favouriteId,
    product: req.body.product,
    user: req.user._id,
  })
    .then((favourite) => {
      res.send("Product added to wishlist");
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

router.get("/mywishlist", auth, (req, res) => {
  Favourite.getUserWish(req.user._id)
    .then((favourite) => {
      res.send(favourite);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

router.delete("/delete/:id", auth, async (req, res) => {
  Favourite.deleteFavourite(req.params.id)
    .then((favourite) => {
      res.send("Product removed successfully");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

module.exports = router;

const express = require("express");
const auth = require("../middleware/auth");
const Comment = require("../models/comment");
const { v4 } = require("uuid");

const router = express.Router();

Comment.createTable();

router.post("/add", auth, (req, res) => {
  const commentId = v4();
  if (!req.body.message) return res.status(400).send("Message not define");
  if (!req.body.product) return res.status(400).send("Product id not define");

  Comment.createComment({
    id: commentId,
    message: req.body.message,
    product: req.body.product,
    user: req.user._id,
  })
    .then((comment) => {
      res.send("Comment added");
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

router.get("/product/:id", (req, res) => {
  Comment.getProductComment(req.params.id)
    .then((comments) => {
      res.send(comments);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

module.exports = router;

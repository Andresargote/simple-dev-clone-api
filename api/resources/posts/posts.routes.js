const express = require("express");
const postRouter = express.Router();

const { createPost } = require("./posts.controller");
const validatePost = require("./posts.validate");

postRouter.get("/posts", (req, res) => {
  res.send("Hola mundo");
});

postRouter.post("/post/create", validatePost, (req, res) => {
  createPost(req.body)
    .then((post) => {
      return res.status(201).json({ post });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send("Error al tratar de crear un post");
    });
});

module.exports = { postRouter };

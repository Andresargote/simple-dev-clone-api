const express = require("express");
const postRouter = express.Router();

const {
  getPosts,
  getSpecificPost,
  createPost,
  updatePost,
  deletePost,
} = require("./posts.controller");
const validatePost = require("./posts.validate");

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    return res
      .status(400)
      .send(`The id ${id} supplied in the URL is not valid`);
  }

  next();
};

postRouter.get("/", (req, res) => {
  getPosts()
    .then((posts) => {
      return res.status(200).json(posts);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
});

postRouter.get("/post/:id", validateId, (req, res) => {
  getSpecificPost(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).send("Post not found");
      }
      return res.status(200).json(post);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send("Error trying to get a specific post");
    });
});

postRouter.post("/post/create", validatePost, (req, res) => {
  createPost(req.body)
    .then((post) => {
      return res.status(201).json(post);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send("Error al tratar de crear un post");
    });
});

postRouter.put("/post/update/:id", [validateId, validatePost], (req, res) => {
  updatePost(req.params.id, req.body)
    .then((post) => {

      if(!post) {
        return res.status(404).send("Post not found");
      }
      return res.status(200).json(post);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send("Error trying to update a post")
    })
})

postRouter.delete("/post/delete/:id", validateId, (req, res) => {
  deletePost(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).send("Post not found");
      }
      return res.status(200).json(post);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send("Error trying to delete a post");
    });
});

module.exports = { postRouter };

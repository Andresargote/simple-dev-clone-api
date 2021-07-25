const express = require("express");
const passport = require("passport");
const postRouter = express.Router();

const jwtAuthenticate = passport.authenticate("jwt", { session: false });

const {
  getPosts,
  getSpecificPost,
  getPostsByUsername,
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

postRouter.get("/post/:id/:slug", validateId, (req, res) => {
  getSpecificPost(req.params.id)
    .then((post) => {
      //en realidad hay que verificar si el usuario existe
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

postRouter.get("/posts/:username", (req, res) => {
  getPostsByUsername(req.params.username)
    .then((posts) => {
      if (!posts) {
        return res.status(404).send("Post not found");
      }

      return res.status(200).json(posts);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error trying to get posts by username");
    });
});

postRouter.post("/post/create", [jwtAuthenticate, validatePost], (req, res) => {
  createPost(req.body, req.user.username)
    .then((post) => {
      return res.status(201).json(post);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send("Error al tratar de crear un post");
    });
});

postRouter.put("/post/update/:id", [jwtAuthenticate, validateId, validatePost], async (req, res) => {
    try {
      const post = await getSpecificPost(req.params.id);

      if (!post) {
        return res.status(404).send("Post not found");
      }

      if (post.creator !== req.user.username) {
        return res
          .status(401)
          .send("You can’t update a post that doesn’t belong to you");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error trying to get posts by username");
    }

    updatePost(req.params.id, req.body)
      .then((post) => {
        return res.status(200).json(post);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error trying to update a post");
      });
  }
);

postRouter.delete("/post/delete/:id", [jwtAuthenticate, validateId], async (req, res) => {
    
  try {
      const post = await getSpecificPost(req.params.id);

      if (!post) {
        return res.status(404).send("Post not found");
      }

      if (post.creator !== req.user.username) {
        return res
          .status(401)
          .send("You can’t update a post that doesn’t belong to you");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error trying to get posts by username");
    }

    deletePost(req.params.id)
      .then((post) => {
        return res.status(200).json(post);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send("Error trying to delete a post");
      });
  }
);

module.exports = { postRouter };

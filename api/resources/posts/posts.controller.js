const Post = require("./posts.models");

function createPost(post) {
  const newPost = new Post({
    ...post,
  });

  return newPost.save();
}

module.exports = { createPost };

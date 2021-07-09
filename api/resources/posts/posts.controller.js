const Post = require("./posts.models");

function getPosts() {
  return Post.find();
}

function getSpecificPost(id){
  return Post.findById(id)
}

function createPost(post, user) {
  const newPost = new Post({
    ...post,
    creator: user
  });

  return newPost.save();
}

function updatePost(id, body) {
  return Post.findOneAndUpdate({_id: id}, {
    ...body
  }, {
    new: true //la opcion d new es para que la llamada regrese el nuevo documento modificado
  })
}

function deletePost(postId) {
  return Post.findByIdAndRemove(postId);
}

module.exports = { getPosts, getSpecificPost, createPost, updatePost, deletePost };

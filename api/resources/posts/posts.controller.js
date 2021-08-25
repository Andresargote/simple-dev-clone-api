const Post = require("./posts.models");

function getPosts() {
  return Post.find();
}

function getSpecificPost(slug){
  return Post.findOne({slug: slug});
}

function getPostsByUsername(username){
  return Post.find({creator: username})
}

function createPost(post, user, img) {

  const newPost = new Post({
    ...post,
    creator: user,
    userImg: img,
  });
  
  return newPost.save();
}

function updatePost(slug, body) {
  return Post.findOneAndUpdate({slug: slug}, {
    ...body
  }, {
    new: true //la opcion d new es para que la llamada regrese el nuevo documento modificado
  })
}

function deletePost(slug) {
  return Post.findOneAndDelete({slug: slug});
}

module.exports = { getPosts, getSpecificPost, getPostsByUsername,createPost, updatePost, deletePost };

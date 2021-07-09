const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "The post must have a title"],
  },
  content: {
    type: String,
    required: [true, "The post must have content"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  creator: {
    type: String,
    required: [true, "The post must be associated with a user"],
  },
});

postSchema.methods.toJSON = function () {
  const { __v, _id, ...post } = this.toObject();
  post.id = _id;
  return post;
};

module.exports = mongoose.model("Post", postSchema);

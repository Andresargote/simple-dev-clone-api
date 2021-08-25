const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

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
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
  creator: {
    type: String,
    required: [true, "The post must be associated with a user"],
  },
  userImg: {
    type: String,
  }
});

postSchema.methods.toJSON = function () {
  const { __v, _id, ...post } = this.toObject();
  post.id = _id;
  return post;
};

module.exports = mongoose.model("Post", postSchema);

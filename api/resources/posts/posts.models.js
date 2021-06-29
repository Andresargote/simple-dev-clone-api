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
});

module.exports = mongoose.model("Post", postSchema);

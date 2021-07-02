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

postSchema.methods.toJSON = function(){
  const {__v, _id, ...user} = this.toObject();
  user.id = _id;
  return user;
}

module.exports = mongoose.model("Post", postSchema);

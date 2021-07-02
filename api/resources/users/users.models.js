const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "The username is required"],
  },
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
});

userSchema.methods.toJSON = function(){
  const {__v, _id, ...user} = this.toObject();
  user.id = _id;
  return user;
}

module.exports = mongoose.model("User", userSchema);

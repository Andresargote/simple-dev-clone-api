const User = require("./users.models");

function getUsers() {
  return User.find();
}

function getSpecificUser(username) {
  return User.findOne({ username: username });
}

function getSpecificUserByEmail(email) {
  return User.findOne({ email: email });
}

function createUser(user) {
  const newUser = new User({
    ...user,
  });

  return newUser.save(user);
}

function updateUser(username, body) {
  return User.findOneAndUpdate(
    { username: username },
    { ...body },
    { new: true }
  );
}

function deleteUser(username) {
  return User.findOneAndRemove({ username: username });
}

function saveUrlImage(username, imgUrl) {
  return User.findOneAndUpdate(
    { username: username },
    {
      img: imgUrl,
    },
    {
      new: true,
    }
  );
}

module.exports = {
  getUsers,
  getSpecificUser,
  getSpecificUserByEmail,
  updateUser,
  createUser,
  deleteUser,
  saveUrlImage
};

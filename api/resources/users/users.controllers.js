const User = require("./users.models");

function getUsers(){
  return User.find();
}

function createUser(user) {
    const newUser = new User({
    ...user,
  });

  return newUser.save(user);
}

module.exports = {
  getUsers,
  createUser,
};

const User = require("./users.models");

function createUser(user) {
    const newUser = new User({
    ...user,
  });

  return newUser.save(user);
}

module.exports = {
  createUser,
};

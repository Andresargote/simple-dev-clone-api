const express = require("express");
const userRouter = express.Router();
const bcryptjs = require("bcryptjs");

const validateUser = require("./users.validate");
const User = require("./users.models");
const { getUsers, createUser } = require("./users.controllers");

userRouter.get("/", (req, res) => {
  getUsers()
    .then((users) => {
      return res.status(200).json(users);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send("An error occurred while trying to get users");
    });
});

userRouter.post("/", validateUser, async (req, res) => {
  //validemos si el username o email ya estan registrados(Refactorizar)
  const { username, email, password } = req.body;

  const usernameExists = await User.findOne({ username: username });
  const emailExists = await User.findOne({ email: email });

  if (usernameExists && emailExists) {
    return res.status(400).send("The username and email are already taken");
  } else if (usernameExists) {
    return res.status(400).send("The username is already taken");
  } else if (emailExists) {
    return res.status(400).send("The email is already taken");
  }

  //encriptar
  const salt = bcryptjs.genSaltSync();
  req.body.password = bcryptjs.hashSync(password, salt);

  createUser({
    ...req.body,
  })
    .then((user) => {
      return res.status(201).json(user);
    })
    .catch((error) => {
      console.error("An attempt to create a user failed", error);
      return res.status(500).send("An attempt to create a user failed");
    });
});

module.exports = {
  userRouter,
};

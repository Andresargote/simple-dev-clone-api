const express = require("express");
const userRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  validateUser,
  validateUpdateUser,
  validateLogin,
} = require("./users.validate");
const User = require("./users.models");
const {
  getUsers,
  getSpecificUser,
  getSpecificUserByEmail,
  updateUser,
  createUser,
  deleteUser,
} = require("./users.controllers");

userRouter.get("/", (req, res) => {
  getUsers()
    .then((users) => {
      return res.status(200).json(users);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while trying to get users");
    });
});

userRouter.get("/:username", (req, res) => {
  getSpecificUser(req.params.username)
    .then((users) => {
      if (!users) {
        return res.status(404).send("User not found");
      }
      return res.status(200).json(users);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred obtaining a specific user");
    });
});

userRouter.post("/", validateUser, async (req, res) => {
  //validemos si el username o email ya estan registrados(Refactorizar)
  const { username, email, password } = req.body;

  //esto se debe de encerrar en un try/catch por si falla
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

userRouter.post("/login", validateLogin, async (req, res) => {
  let userExist;

  try {
    userExist = await getSpecificUserByEmail(req.body.email);

    if (!userExist) {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    return res.status(500).send("An error occurred obtaining a specific user");
  }

  const hashedPassword = userExist.password;

  bcryptjs.compare(req.body.password, hashedPassword, (err, sucess) => {
    console.error(err);

    if (sucess) {
      const token = jwt.sign(
        {
          id: req.body.id,
        },
        "estO_ESseCREto",
        {
          expiresIn: "24h",
        }
      );

      console.log("Successfully authenticated user");

      return res.status(200).json({ token });
    } else {
      console.error("Authentication failed");
      return res.status(400).send("Wrog credentials");
    }
  });
});

userRouter.put("/update/:username", validateUpdateUser, async (req, res) => {
  //Validamos que el usuario exista
  try {
    const userExist = await getSpecificUser(req.params.username);

    if (!userExist) {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    return res.status(500).send("An error occurred obtaining a specific user");
  }

  updateUser(req.params.username, req.body)
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred updaiting a specific user");
    });
});

userRouter.delete("/delete/:username", async (req, res) => {
  //Validamos que el usuario exista
  try {
    const userExist = await getSpecificUser(req.params.username);

    if (!userExist) {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    return res.status(500).send("An error occurred obtaining a specific user");
  }

  deleteUser(req.params.username)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send("An error occurred deleting a specific user");
    });
});

module.exports = {
  userRouter,
};

const express = require("express");
const passport = require("passport");
const userRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const jwtAuthenticate = passport.authenticate("jwt", { session: false });

const {
  validateUser,
  validateUpdateUser,
  validateUserImage,
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
  saveUrlImage,
} = require("./users.controllers");
const { saveImage } = require("../../data/images.controller.js");

const config = require("../../../config");

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

//Buscar usuario pasandole un token
userRouter.get("/token", jwtAuthenticate, (req, res) => {
  getSpecificUser(req.user.username)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      return res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred obtaining a specific user");
    });
});

userRouter.get("/:username", (req, res) => {
  getSpecificUser(req.params.username)
    .then((users) => {
      if (!users) {
        return res.status(404).send({ error: "User not found" });
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
    return res
      .status(400)
      .json({ error: "The username and email are already taken" });
  } else if (usernameExists) {
    return res.status(400).json({ error: "The username is already taken" });
  } else if (emailExists) {
    return res.status(400).json({ error: "The email is already taken" });
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
      return res
        .status(500)
        .json({ error: "An attempt to create a user failed" });
    });
});

userRouter.post("/login", validateLogin, async (req, res) => {
  let userExist;

  try {
    userExist = await getSpecificUserByEmail(req.body.email);

    if (!userExist) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred obtaining a specific user" });
  }

  const hashedPassword = userExist.password;

  bcryptjs.compare(req.body.password, hashedPassword, (err, sucess) => {
    console.error(err);

    if (sucess) {
      const token = jwt.sign(
        {
          email: req.body.email,
        },
        config.jwt.secret,
        {
          expiresIn: config.jwt.experationTime,
        }
      );

      console.log("Successfully authenticated user");

      return res.status(200).json({
        name: userExist.name,
        username: userExist.username,
        token: token,
      });
    } else {
      console.error("Authentication failed");
      return res.status(400).json({ error: "Wrong credentials" });
    }
  });
});

userRouter.put("/update/:username",[jwtAuthenticate, validateUpdateUser], async (req, res) => {
    //Validamos que el usuario exista
    try {
      const userExist = await getSpecificUser(req.params.username);

      if (!userExist) {
        return res.status(404).send({ error: "User not found" });
      }

      if (userExist.username !== req.user.username) {
        return res
          .status(401)
          .send({ error: "You cannot update a user other than you" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ error: "An error occurred obtaining a specific user" });
    }

    updateUser(req.params.username, req.body)
      .then((user) => {
        return res.status(200).json(user);
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .send({ error: "An error occurred updaiting a specific user" });
      });
  }
);

userRouter.put("/:username/image",[jwtAuthenticate, validateUserImage], async (req, res) => {
    //TO-DO falta agregar un manejador de errores para imagenes demasiado grandes(En el curso de APPDELANTE crean un Error handler).
    try {
      const userExist = await getSpecificUser(req.params.username);

      if (!userExist) {
        return res.status(404).send({ error: "User not found" });
      }

      if (userExist.username !== req.user.username) {
        return res
          .status(401)
          .send({ error: "You cannot update a user other than you" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ error: "An error occurred obtaining a specific user" });
    }

    try {
      const username = req.params.username;
      const nameImage = `${uuidv4()}.${req.extensionFile}`;
      console.log("Image ---------", req.extensionFile)

      await saveImage(req.body, nameImage, extensionFile);

      const urlImg = `https://dev-clone-upload.s3.amazonaws.com/${nameImage}`;
      const userAndImage = await saveUrlImage(username, urlImg);

      return res.json(userAndImage);
    } catch (error) {
      console.log("----------------------------erorr----------------------", error)
      return res.status(500).send({error: "An error occurred while trying to save an image"})
    }
  }
);

userRouter.delete("/delete/:username", jwtAuthenticate, async (req, res) => {
  //Validamos que el usuario exista
  try {
    const userExist = await getSpecificUser(req.params.username);

    if (!userExist) {
      return res.status(404).send("User not found");
    }

    if (userExist.username !== req.user.username) {
      return res.status(401).send("You cannot update a user other than you");
    }
  } catch (error) {
    return res.status(500).send("An error occurred obtaining a specific user");
  }

  deleteUser(req.params.username)
    .then((user) => {
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

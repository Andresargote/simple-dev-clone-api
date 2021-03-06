require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");

const { dbConnection } = require("./database/config");
const app = express();
const { postRouter } = require("./api/resources/posts/posts.routes");
const { userRouter } = require("./api/resources/users/users.routes");
const jwtStrategy = require("./api/auth/auth");
const config = require("./config");


passport.use(jwtStrategy);
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: "image/*", limit: "1mb" }));

dbConnection();

app.use(passport.initialize());

app.use("/api", postRouter);
app.use("/api/user", userRouter);

app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});

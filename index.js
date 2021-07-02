require("dotenv").config();
const express = require("express");

const { dbConnection } = require("./database/config");
const app = express();
const { postRouter } = require("./api/resources/posts/posts.routes");
const { userRouter } = require("./api/resources/users/users.routes");

app.use(express.json());

dbConnection();

app.use("/api", postRouter);
app.use("/api/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});

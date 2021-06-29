const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("Conectado a la base de datos");
  } catch (error) {
    throw new Error("Error con la conexion a la base de datos", error);
  }
};

module.exports = {
  dbConnection
};

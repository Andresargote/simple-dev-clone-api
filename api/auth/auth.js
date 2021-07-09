const passportJWT = require("passport-jwt");
const User = require("../resources/users/users.models");

const { getSpecificUserByEmail } = require("../resources/users/users.controllers");

const jwtOptions = {
  secretOrKey: "estO_ESseCREto",
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtStrategy = new passportJWT.Strategy(
  jwtOptions,
  async (jwtPayload, next) => {
    try {
      const user = await getSpecificUserByEmail(jwtPayload.email);

      console.log("Aquii", user)

      if (!user) {
        console.error("JWT is not valid");
        return next(null, false);
      }

      console.log("JWT is valid");
      next(null, {
        username: user.username,
        id: user.id,
      });

    } catch (error) {
        console.error(error);
    }
  }
);

module.exports = jwtStrategy;
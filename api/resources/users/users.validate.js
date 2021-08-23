const Joi = require("joi");

const schema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
});

const schemaUserUpdate = Joi.object({
  websiteUrl: Joi.string().allow("").uri(),
  location: Joi.string().allow(""),
  bio: Joi.string().allow(""),
  imgUrl: Joi.string().allow("").uri(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
});

const validateUser = (req, res, next) => {
  const result = schema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (result.error === undefined) {
    return next();
  } else {
    const validationsErrors = result.error.details.reduce(
      (accumulator, error) => {
        return accumulator + `[${error.message}]`;
      },
      ""
    );

    console.warn(
      `The user did not pass the validation. Errors in the request: ${validationsErrors}`
    );
    return res
      .status(400)
      .send(
        `The user must contain a title of max 100 characters and a content. Errors in the request: ${validationsErrors}`
      );
  }
};

const validateUpdateUser = (req, res, next) => {
  const result = schemaUserUpdate.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (result.error === undefined) {
    return next();
  } else {
    const validationsErrors = result.error.details.reduce(
      (accumulator, error) => {
        return accumulator + `[${error.message}]`;
      },
      ""
    );

    console.warn(
      `The user did not pass the validation. Errors in the request: ${validationsErrors}`
    );
    return res.status(400).send(`Errors in the request: ${validationsErrors}`);
  }
};

const validateLogin = (req, res, next) => {
  const result = schemaLogin.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (result.error === undefined) {
    next();
  } else {
    res.status(400).send("Login failed");
  }
};

module.exports = {
  validateUser,
  validateUpdateUser,
  validateLogin
};

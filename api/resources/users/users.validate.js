const Joi = require("joi");

const schema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  websiteUrl: Joi.string().uri(),
  location: Joi.string().min(3), 
  bio: Joi.string()
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
    return res.status(400).send(`The user must contain a title of max 100 characters and a content. Errors in the request: ${validationsErrors}`)
  }
};

module.exports = validateUser;
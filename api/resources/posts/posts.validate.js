const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string().max(100).required(),
  content: Joi.string().required(),
});

const validatePost = (req, res, next) => {
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
      `The post did not pass the validation. Errors in the request: ${validationsErrors}`
    );
    return res
      .status(400)
      .send({error: `The post must contain a title of max 100 characters and a content. Errors in the request: ${validationsErrors}`});
  }
};

module.exports = validatePost;

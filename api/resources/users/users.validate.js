const Joi = require("joi");
const fileType = require("file-type");

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

const CONTENT_TYPES_ALLOWED = ["image/jpeg", "image/jpg", "image/png"];

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

const validateUserImage = async (req, res, next) => {
  let contentType = req.get("content-type");

  if (!CONTENT_TYPES_ALLOWED.includes(contentType)) {
    console.warn(
      `Request to modify the user's [] image does not have a valid content-type [${contentType}]`
    );
    return res
      .status(400)
      .send(
        `Files of type ${contentType} are not supported. Use one of ${CONTENT_TYPES_ALLOWED.join(
          ", "
        )}`
      );
  }

  try {
    let infoFile = await fileType.fromBuffer(req.body);
  
    console.log("-----------------------------------InfoFile", infoFile, req.body);
    console.log("-----------------------------------ContentType", contentType);
  
    if (!CONTENT_TYPES_ALLOWED.includes(infoFile.mime)) {
      const mensaje = `Disparity between content-type [${contentType}] and file type [${infoFile.ext}]. Request will not be processed`;
      return res.status(400).send(mensaje);
    } 
  
    req.extensionFile = infoFile.ext;
  
    next();
  }catch(e){
    console.error(e);
    return res.status(500).send({error:"An error occurred while trying to process the image"});
  }

};

module.exports = {
  validateUser,
  validateUpdateUser,
  validateUserImage,
  validateLogin
};

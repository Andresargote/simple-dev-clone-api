const environment = process.env.NODE_ENV || "development";

const baseConfig = {
  jwt: {},
  port: process.env.PORT || 8080,
  S3: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "us-east-1"
  },
};

let environmentConfig = {};

switch (environment) {
  case "development":
  case "dev":
    environmentConfig = require("./dev");
    break;
  case "production":
  case "prod":
    environmentConfig = require("./prod");
    break;
  default:
    environmentConfig = require("./dev");
}

module.exports = {
  ...baseConfig,
  ...environmentConfig,
};

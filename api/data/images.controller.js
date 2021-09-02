require("dotenv").config();

const AWS = require("aws-sdk");
const config = require("../../config");

const s3Client = new AWS.S3({ ...config.S3 });

const saveImage = (imgData, fileName, extensionFile) => {
    return s3Client.putObject({
        Body: imgData,
        Bucket: "dev-clone-upload",
        Key: `${fileName}`,
        ContentType: `image/${extensionFile}` 
    }).promise()
};

module.exports = {
    saveImage, 
}
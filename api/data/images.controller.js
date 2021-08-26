const AWS = require("aws-sdk");
const config = require("../../config");

const s3Client = new AWS.S3({ ...config.s3 });

const saveImage = (imgData, fileName) => {
    return s3Client.putObject({
        Body: imgData,
        Bucket: "dev-clone-upload",
        Key: `${fileName}`,
    }).promise()
};

module.exports = {
    saveImage, 
}
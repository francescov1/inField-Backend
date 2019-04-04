"use strict";
const config = require("./");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: config.aws.access_key_id,
  secretAccessKey: config.aws.secret_access_key,
  region: config.aws.region
});

module.exports = {
  s3: new AWS.S3({ apiVersion: config.aws.version })
};

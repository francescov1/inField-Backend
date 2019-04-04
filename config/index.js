'use strict';
require("dotenv").config();
module.exports = {
  model: {
    api_base_url: process.env.MODEL_API_BASE_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY
  },
  rate_limit: {
    api_window: process.env.API_RATE_LIMIT_WINDOW,
    api_max: process.env.API_RATE_LIMIT_MAX,
    auth_window: process.env.AUTH_RATE_LIMIT_WINDOW,
    auth_max: process.env.AUTH_RATE_LIMIT_MAX,
  },
  twilio: {
    account_sid: process.env.PROD_TWILIO_ACCOUNT_SID,
    auth_token: process.env.PROD_TWILIO_AUTH_TOKEN,
    sender_id: process.env.TWILIO_SENDER_ID
  },
  mailer: {
    username: process.env.MAILER_USERNAME,
    password: process.env.MAILER_PASSWORD,
  },
  aws: {
    version: process.env.AWS_VERSION,
    region: process.env.AWS_REGION,
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    s3_bucket_name: process.env.S3_BUCKET_NAME
  },
  database: process.env.MONGODB_URI,
  web_url: process.env.WEB_URL,
  api_url: process.env.API_URL,
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000
};

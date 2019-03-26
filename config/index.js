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
  database: process.env.MONGODB_URI,
  web_url: process.env.WEB_URL,
  api_url: process.env.API_URL,
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000
};

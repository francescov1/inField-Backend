'use strict';
// TODO: figure out how to add variables to aws
//if (process.env.NODE_ENV !== "production") require("dotenv").config();
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
  database: process.env.MONGODB_URI,
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000
};

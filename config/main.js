'use strict';
module.exports = {
  model: {
    api_base_url: process.env.MODEL_API_BASE_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY
  },
  database: process.env.MONGODB_URI,
  auth_token: process.env.AUTH_TOKEN,
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000
};

'use strict';
module.exports = {
  'model': {
    'api_base_url': process.env.MODEL_API_BASE_URL
  },
  'auth_token': process.env.AUTH_TOKEN,
  'node_env': process.env.NODE_ENV || 'development',
  'api_url': process.env.API_URL,
  'port': process.env.PORT || 3000
};

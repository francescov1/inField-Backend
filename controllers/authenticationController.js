'use strict';
const config = require('../config/main');

const { UnauthorizedError } = require('../errors/custom');

module.exports = {

  // this should be developed into a professional auth system. Current auth fine for testing and MVP purposes

  apiAuth: function(req, res, next) {
    const authToken = req.headers['auth_token'];
    if (!authToken || authToken !== config.auth_token)
      throw new UnauthorizedError('Authentication token required');

    return next();
  }
};

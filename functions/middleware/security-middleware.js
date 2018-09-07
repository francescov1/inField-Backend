const config = require('../config.js');
const debug = config.env.debug;
const debugToken = config.env.debug_token;
var admin = config.firebase.admin;

const express = require('express');

// ======================== security middleware =========================== //

// for production environment
function verifyIdToken(req, res, next) {

}

// for development and debugging environment
function verifyDebugToken(req, res, next) {

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return next('Unauthorized');
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];

  if (idToken !== debugToken) {
    console.log('Unauthorized request. Auth header: ' + req.headers.authorization);
    return next('Unauthorized');
  }
  else
    return next();
}

if (debug)
  module.exports = verifyDebugToken;
else
  module.exports = verifyIdToken;

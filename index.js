'use strict';
require('dotenv').config();
const config = require('./config/main');
const bodyParser = require('body-parser');
const logger = require('morgan');
const express = require('express');
const router = require('./router');
Promise = require('bluebird');

const app = express();

// basic middleware
app.use(logger(config.node_env === 'production' ? 'combined' : 'dev'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Expose-Headers", "auth-token");
  return next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app);

app.listen(config.port);
console.log('Server listening on port ' + config.port + '...');

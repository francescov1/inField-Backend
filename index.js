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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app);

app.listen(config.port);
console.log('Server listening on port ' + config.port + '...');

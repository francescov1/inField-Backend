'use strict';
require("./helpers/date");
Promise = require('bluebird');
const config = require('./config');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('morgan');
const express = require('express');
const router = require('./router');

// init db
require("./config/mongoose")();

// Run cron jobs
require("./scripts/cron")();

const app = express();

// basic middleware
app.enable("trust proxy");
app.use(helmet());
app.use(logger(config.node_env === 'production' ? 'combined' : 'dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app);

app.listen(config.port, () => {
  console.log(`server listening on port ${config.port}...`);
  console.log(`environment: ${config.node_env}`);
});

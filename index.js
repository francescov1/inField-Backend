'use strict';
require("./helpers/date");
Promise = require('bluebird');
const config = require('./config');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('morgan');
const express = require('express');
const router = require('./router');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.connection.on("connected", () => console.log("mongodb connected"));
mongoose.connection.on("open", () => console.log("mongodb connection opened"));
mongoose.connection.on("error", err => console.log("mongodb error: " + err));
mongoose.connection.on("disconnected", () => {
  console.log("mongodb disconnected");
});
process.on("SIGINT", () => {
  mongoose.connection.close(() => process.exit(0));
});

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

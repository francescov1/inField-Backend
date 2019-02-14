'use strict';
const config = require('./');
const Twilio = require('twilio');
module.exports = new Twilio(config.twilio.account_sid, config.twilio.auth_token);

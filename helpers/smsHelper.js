"use strict";
const config = require("../config");
const twilio = require('../config/twilio');

const { NotAllowedError } = require("../errors");

module.exports = {

  phoneVerification: function(user) {
    if (config.node_env === "test") return;

    return twilio.messages.create({
      body: `Your Infield ID verification code is ${user.phoneVerificationToken}`,
      to: user.phone,
      from: config.twilio.sender_id
    });
  }

};

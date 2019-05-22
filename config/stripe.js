"use strict";
const config = require("./");
module.exports = require("stripe")(config.stripe.api_key);

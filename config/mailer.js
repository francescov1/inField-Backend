"use strict";
const config = require("./");
const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  service: "Zoho",
  host: "smtp.zoho.com",
  secure: true,
  port: 587,
  auth: {
    user: config.mailer.username,
    pass: config.mailer.password
  },
  tls: { rejectUnauthorized: false }
});

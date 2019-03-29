"use strict";
const config = require("../config");
const mailer = require("../config/mailer");

module.exports = {
  accountVerification: function(user) {
    if (config.node_env === "test") return;

    return mailer.sendMail({
      from: `"InField No Reply" ${config.mailer.username}`,
      to: user.email,
      subject: `Verify your new InField ID account!`,
      html: `Hello ${
        user.name
      },<br/><br/>Welcome to InField ID! Please click the URL below to verify your new InField ID account and get started with our services.</br>${
        config.api_url
      }/auth/verifyEmail/${
        user.emailVerificationToken
      }<br/><br/>Best,<br/>InField ID`
    });
  },

  resetPassword: function(user) {
    if (config.node_env === "test") return;

    return mailer.sendMail({
      from: `"InField No Reply" ${config.mailer.username}`,
      to: user.email,
      subject: `Reset your account password`,
      html: `Hello ${
        user.name
      },<br/><br/>You are receiving this email because you have requested to reset your InField ID account password. Please click the link below to do so now, the link will expire in one day.<br/>${
        config.api
      }/auth/resetPassword/${
        user.resetPasswordToken
      }<br/><br/>If you did not request this, please ignore this email.<br/><br/>Best,<br/>InField ID`
    });
  }
};

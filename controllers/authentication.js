'use strict';
const config = require('../config');
const passport = require("../config/passport");
const mailer = require("../helpers/mailerHelper");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");
const User = require("../models/user");

const {
  UnauthorizedError,
  JwtExpiredError,
  InvalidArgumentError,
  NotAllowedError,
  NotFoundError
} = require('../errors');

// all authentication functionality
module.exports = {

  // verify api token
  apiAuth: function(req, res, next) {
    passport.authenticate("jwt", { session: false }, function(err, user, info) {
      if (err) return next(err);
      if (info && info.name === "TokenExpiredError")
        return next(new JwtExpiredError());
      if (!user) return next(new UnauthorizedError("User Not Found"));

      req.user = user;
      return next();
    })(req, res, next);
  },


  // custom registration
  register: function(req, res, next) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const dob = req.body.dob;
    const accountType = req.body.accountType;
    const company = req.body.company;

    if (!email || !password)
      return next(
        new InvalidArgumentError("You must enter an email address and password")
      );
    if (!firstName || !lastName)
      return next(new InvalidArgumentError("You must enter your full name"));

    return User.findOne({ email: email })
      .then(existingUser => {
        if (existingUser)
          throw new NotAllowedError("That email address is already in use");

        const emailVerificationToken = uuidv4();

        let newUser = new User({
          email,
          password,
          firstName,
          lastName,
          emailVerificationToken,
          dob,
          accountType,
          company
        });

        // set email verified for tests
        if (config.node_env === "test") newUser.emailVerified = true;
        return newUser.save();
      })
      .then(user => {
        mailer.accountVerification(user);

        return res.status(201).send({
          token: "JWT " + jwt.sign({ _id: user._id }, config.jwt.secret, {
            expiresIn: Number(config.jwt.expiry)
          }),
          user: user.filterForClient()
        })
      })
      .catch(err => next(err));
  },

  // login
  login: function(req, res, next) {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return next(new UnauthorizedError(info.error));
        if (user.emailVerified !== true)
          return next(
            new UnauthorizedError("You must verify your email address to login")
          );

        return res.status(201).send({
          token: "JWT " + jwt.sign({ _id: user._id }, config.jwt.secret, {
            expiresIn: Number(config.jwt.expiry)
          }),
          user: user.filterForClient()
        })
      }
    )(req, res, next);
  },

  // TODO: test
  // request to reset a custom account password
  resetPasswordRequest: function(req, res, next) {
    const email = req.body.email;
    return User.findOne({ email: email })
      .then(user => {
        if (!user) throw new NotFoundError("User not found");
        if (!user.password)
          throw new NotAllowedError(
            "You cannot reset your password if your account is linked to Facebook"
          );

        const resetToken = uuidv4();
        user.resetPasswordToken = resetToken;
        // expires in one day
        const today = new Date();
        user.resetPasswordExpires = today.addDays(1);

        return user.save();
      })
      .then(user => mailer.resetPassword(user))
      .then(() => res.status(201).send({ success: true }))
      .catch(err => next(err));
  },

  // TODO: test
  // reset custom account password
  resetPassword: function(req, res, next) {
    const token = req.params.token;
    const password = req.body.password;

    const today = new Date();

    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: today }
    })
      .then(user => {
        if (!user)
          throw new NotFoundError("Verification URL invalid or expired");

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        return user.save();
      })
      .then(user => res.status(201).send({ success: true }))
      .catch(err => next(err));
  },

  // verify user email address after account creation
  verifyEmail: function(req, res, next) {
    const token = req.params.token;

    return User.findOne({ emailVerificationToken: token, emailVerified: false })
      .then(user => {
        if (!user) throw new NotFoundError("Verification URL invalid");

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        return user.save();
      })
      .then(user => res.status(200).send({ success: true }))
      .catch(err => next(err));
  },

  // TODO: test
  // resend account verification email
  resendVerificationEmail: function(req, res, next) {
    const email = req.body.email;

    return User.findOne({ email: email, emailVerified: false })
      .then(user => {
        if (!user)
          throw new NotFoundError("User not found or email already verified");

        user.emailVerificationToken = uuidv4();
        return user.save();
      })
      .then(user => mailer.accountVerification(user))
      .then(() => res.status(201).send({ success: true }))
      .catch(err => next(err));
  },

};

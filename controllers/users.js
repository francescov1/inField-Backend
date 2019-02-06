'use strict';
const config = require("../config/main");
const sms = require("../helpers/smsHelper");
const mailer = require("../helpers/mailerHelper");
const User = require("../models/user");
const Rating = require('../models/rating');
const ObjectId = require('mongoose').Types.ObjectId;

const {
  NoDataError,
  NotFoundError,
  InvalidArgumentError,
  NotAllowedError
} = require("../errors/custom.js");

module.exports = {
  // get me
  getMe: function(req, res, next) {
    return res.status(200).send(req.user.filterForClient());
  },

  // edit user
  editMe: function(req, res, next) {
    if (!req.body) return next(new NoDataError());
    let user = req.user;
    const userEdits = req.body;
    // TODO: add this as mongoose middleware
    // TODO: manually set new stuff instead
    if (
      userEdits.emailVerified ||
      userEdits.salt ||
      userEdits.resetPasswordToken ||
      userEdits.resetPasswordExpires ||
      userEdits.emailVerificationToken
    )
      return next(new InvalidArgumentError("Field cannot be updated"));

    user = Object.assign(user, userEdits);

    return user.save()
      .then(user => res.status(201).send(user.filterForClient()))
      .catch(err => next(err));
  },

  // add phone to user
  addPhone: function(req, res, next) {
    // num must be 11 digit string
    const phone = req.body.phone;

    let user = req.user;
    if (user.phone)
      return next(new NotAllowedError("You have already added a phone number"));

    user.phone = phone;
    user.phoneVerificationToken = Math.floor(1000 + Math.random() * 9000);

    if (config.node_env === "test") user.phoneVerified = true;

    return user
      .save()
      .then(user => sms.phoneVerification(user))
      .then(() => res.status(201).send(user.filterForClient()))
      .catch(err => next(err));
  },

  // verify phone with verification token
  verifyPhone: function(req, res, next) {
    const user = req.user;
    const token = req.body.token;
    if (user.phoneVerified)
      return next(new NotAllowedError("Phone already verified"));
    if (user.phoneVerificationToken !== token)
      return next(new NotFoundError("Verification code invalid"));

    user.phoneVerified = true;
    user.phoneVerificationToken = undefined;
    return user
      .save()
      .then(user => res.status(200).send({ success: true }))
      .catch(err => next(err));
  },

  // resend phone verification token
  resendPhoneVerification: function(req, res, next) {
    const user = req.user;
    if (!user.phone)
      return next(new NotAllowedError("You have not added a phone yet"));
    if (user.phoneVerified)
      return next(new NotAllowedError("Your phone has already been verified"));

    user.phoneVerificationToken = Math.floor(1000 + Math.random() * 9000);
    return user
      .save()
      .then(user => sms.phoneVerification(user))
      .then(() => res.status(201).send({ success: true }))
      .catch(err => next(err));
  },

  // delete phone from user
  deletePhone: function(req, res, next) {
    let user = req.user;
    user.phone = undefined;
    user.phoneVerified = undefined;
    user.phoneVerificationToken = undefined;
    return user
      .save()
      .then(user => res.status(201).send(user.filterForClient()))
      .catch(err => next(err));
  },

  // delete user
  deleteMe: function(req, res, next) {
    return req.user.remove()
      .then(user => res.status(204).send({ success: true }))
      .catch(err => next(err));
  },

  // get user
  getUser: function(req, res, next) {
    const uid = req.params.uid;
    return User.findById(uid)
      .then(user => {
        if (!user) throw new NotFoundError("User not found");

        return res.status(200).send(user.filterForClient());
      })
      .catch(err => next(err));
  },

  // search all users
  searchUsers: function(req, res, next) {
    const name = req.query.name;
    if (!name) throw new NoDataError("No search string provided");

    const names = name.split(" ");
    const numNames = names.length;
    let query = { firstName: { $regex: names[0], $options: "i" } };
    if (numNames > 1)
      query.lastName = { $regex: names[numNames - 1], $options: "i" };

    return User.find(query, "firstName lastName")
      .then(users => res.status(200).send(users))
      .catch(err => next(err));
  },

  getRating: function(req, res, next) {

    const uid = req.user.id;

    return Rating.aggregate([
      { $match: { agronomist: ObjectId(uid) } },
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" }
        }
      },
      { $project: { _id: false, average: true } }
    ])
    .then(ratingArr => {
      const rating = ratingArr[0] ? ratingArr[0].rating : null;
      return res.status(200).send({ rating })
    })
    .catch(err => next(err));
  },

};

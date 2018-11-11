'use strict';
const config = require("../config/main");
const User = require("../models/user");

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

};

'use strict';
const config = require("../config");
const sms = require("../helpers/smsHelper");
const mailer = require("../helpers/mailerHelper");
const User = require("../models/user");
const Rating = require('../models/rating');
const ObjectId = require('mongoose').Types.ObjectId;
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require("../config/aws").s3;

const {
  NoDataError,
  NotFoundError,
  InvalidArgumentError,
  NotAllowedError
} = require("../errors");

// all user functionality
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
    if (
      userEdits.emailVerified ||
      userEdits.salt ||
      userEdits.resetPasswordToken ||
      userEdits.resetPasswordExpires ||
      userEdits.emailVerificationToken ||
      userEdits.specialties ||
      userEdits.regions ||
      userEdits.rating
    )
      return next(new InvalidArgumentError("Field cannot be updated"));

    user = Object.assign(user, userEdits);

    return user.save()
      .then(user => res.status(201).send(user.filterForClient()))
      .catch(err => next(err));
  },

  // for agronomists
  getAvailableSpecialties: function(req, res, next) {
    if (req.user.accountType !== "agronomist")
      throw new NotAllowedError("You must have an agronomist account")

    return res.status(200).send({ specialties: ['corn', 'barley', 'wheat'] });
  },

  // for both farmers and agronomistss
  getAvailableRegions: function(req, res, next) {
    return res.status(200).send({ regions: ['ON', 'BC', 'QC', "AB", 'NS', 'NB', 'NL', 'PE', 'MB', 'SK', 'AB', 'YT', 'NT', 'NU'] });
  },

  // for farmers
  addDefaultRegion: function(req, res, next) {
    const user = req.user;
    if (user.accountType !== "farmer")
      throw new NotAllowedError("You must have a farmer account");

    user.defaultRegion = req.body.region;
    return user.save()
      .then(user => res.status(201).send(user.filterForClient()))
      .catch(err => next(err));
  },

  // add regions or specialties for agronomists
  addSkills: function(req, res, next) {
    const { specialties, regions } = req.body;
    const user = req.user;

    user.specialties.addToSet(...specialties);
    user.regions.addToSet(...regions);
    return user.save()
      .then(user => res.status(201).send(user.filterForClient()))
      .catch(err => next(err));
  },

  // remove specialty for agronomists
  removeSpecialty: function(req, res, next) {
    const specialty = req.body.specialty;
    const user = req.user;

    const idx = user.specialties.indexOf(specialty);

    if (idx > -1) user.specialties.splice(idx, 1);
    return user.save()
      .then(user => res.status(201).send(user.filterForClient()))
      .catch(err => next(err));
  },

  // remove region for agronomists
  removeRegion: function(req, res, next) {
    const region = req.body.region;
    const user = req.user;

    const idx = user.regions.indexOf(region);
    if (idx > -1) user.regions.splice(idx, 1);
    return user.save()
      .then(user => res.status(201).send(user.filterForClient()))
      .catch(err => next(err));
  },

  uploadLegalDoc: [
    function(req, res, next) {
      //if (req.user.accountType !== "agronomist")
      //  throw new NotAllowedError("Must have an agronomist account");
      if (req.query.type !== "credentials" && req.query.type !== "insurance")
        throw new InvalidArgumentError("Legal document type is invalid");

      return next();
    },

    // aws image upload middleware
    multer({
      storage: multerS3({
        s3: s3,
        bucket: config.aws.s3_bucket_name,
        key: (req, file, cb) => {
          cb(
            null,
            `users/${req.user.id}/legal/${req.query.type}-${file.originalname}`
          );
        }
      })
    }).single("image"),

    function(req, res, next) {
      if (!req.file) throw new NotFoundError("No photo found");
      const user = req.user;
      const type = req.query.type;

      // if this fails, simply means photo was already deleted
      if (user.legal && user.legal[type]) {
        s3.deleteObject({
          Key: user.legal[type].split("amazonaws.com/")[1],
          Bucket: config.aws.s3_bucket_name
        }).promise();
      }

      user.legal[type] = req.file.location

      return user.save()
        .then(user => res.status(201).send({ legal: user.legal }))
        .catch(err => next(err));
    }
  ],

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
  }

};

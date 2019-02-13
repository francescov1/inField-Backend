"use strict";
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ============================ User Schema ============================ //

const UserSchema = new Schema(
  {
    accountType: {
      type: String,
      enum: ['agronomist', 'farmer'],
      default: 'farmer'
    },
    specialties: [{
      type: String,
      enum: [
        'corn',
        'barley',
        'wheat'
      ]
    }],
    regions: [{
      type: String,
      enum: [
        'North America',
        'South America',
        'Asia'
      ]
    }],
    email: {
      type: String,
      lowercase: true,
      unique: "Email is already in use",
      required: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    phone: {
      type: String,
      match: /^\d{11}$/
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    phoneVerificationToken: String,
    password: String,
    salt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // TODO: input locations of models in db with coordinates, then find closest one when doing a query
    coordinates: {
      type: [Number],
      index: "2dsphere"
    },
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

// get and set virtual name property
UserSchema.virtual("name")
  .get(function() {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function(name) {
    const names = name.split(" ");
    this.firstName = names[0];
    this.lastName = names[names.length - 1];
  });

// encrypt password before saving
UserSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return next();

  user.salt = crypto.randomBytes(16).toString("hex");
  user.password = crypto
    .pbkdf2Sync(user.password, user.salt, 1000, 64, "sha512")
    .toString("hex");
  return next();
});

// check password function
UserSchema.methods.validatePassword = function(candidatePassword) {
  let hash = crypto
    .pbkdf2Sync(candidatePassword, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.password === hash;
};

UserSchema.methods.filterForClient = function() {
  return {
    _id: this._id,
    email: this.email,
    emailVerified: this.emailVerified,
    phone: this.phone,
    phoneVerified: this.phoneVerified,
    name: this.name,
    regions: this.regions,
    specialties: this.specialties
  };
};

module.exports = mongoose.model("User", UserSchema);

"use strict";
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedRegions = ['ON', 'BC', 'QC', "AB", 'NS', 'NB', 'NL', 'PE', 'MB', 'SK', 'AB', 'YT', 'NT', 'NU'];

// ============================ User Schema ============================ //

const UserSchema = new Schema(
  {
    accountType: {
      type: String,
      enum: ['agronomist', 'farmer'],
      default: 'farmer'
    },
    rating: Number,
    // farmers can only have one 'default' specialty
    // agronomists have no limit (everything they specialise in)
    specialties: [{
      type: String,
      enum: ['corn', 'barley', 'wheat'],
      validate: [validateSpecialties, 'Cannot have more than one default specialty']
    }],
    // farmers can only have one 'default' region
    // agronomists have no limit (everything they specialise in)
    regions: [{
      type: String,
      enum: allowedRegions,
      validate: [validateRegions, 'Cannot have more than one default region']
    }],
    dob: {
      day: { type: Number, required: true },
      month: { type: Number, required: true },
      year: { type: Number, required: true },
    },
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
    password: String,
    salt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    legal: {
      credentials: String,
      insurance: String
    }
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

function validateMaxAttendance(maxAttendance) {
  return this.bounceAttendance ? maxAttendance >= this.bounceAttendance : true;
}

function validateSpecialties(specialty) {
  return this.accountType === 'farmer' ? this.specialties.length <= 1 : true;
}

function validateRegions(region) {
  return this.accountType === 'farmer' ? this.regions.length <= 1 : true;
}

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
    name: this.name,
    dob: this.dob,
    regions: this.regions,
    specialties: this.specialties,
    defaultRegion: this.defaultRegion,
    accountType: this.accountType,
    rating: this.rating
  };
};

module.exports = mongoose.model("User", UserSchema);

"use strict";
const stripe = require('../config/stripe');
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedRegions = ['ON', 'BC', 'QC', "AB", 'NS', 'NB', 'NL', 'PE', 'MB', 'SK', 'AB', 'YT', 'NT', 'NU'];

// ============================ User Schema ============================ //

// TODO: add phone number (especially for sales rep)

const UserSchema = new Schema(
  {
    accountType: {
      type: String,
      enum: ['agronomist', 'farmer', 'salesRep'],
      default: 'farmer'
    },
    rating: Number,
    // farmers and agronomists have no limit (everything they specialise in)
    crops: [{
      type: String,
      enum: ['corn', 'barley', 'wheat']
    }],
    // farmers and sales reps can only have one 'default' region
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
    },
    stripe: {
      customerId: String,
      connectId: String
    },
    // company for sales reps
    company: String,
    cards: [{
      _id: { type: String, required: true },
      card_holder_name: String,
      brand: { type: String, required: true },
      exp: { type: Date, required: true },
      funding: { type: String, required: true },
      last4: { type: String, required: true }
    }],
    banks: [{
      _id: { type: String, required: true },
      account_holder_name: String,
      bankName: { type: String, required: true },
      routing: { type: String, required: true },
      last4: { type: String, required: true }
    }],
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

function validateMaxAttendance(maxAttendance) {
  return this.bounceAttendance ? maxAttendance >= this.bounceAttendance : true;
}

function validateRegions(region) {
  if (this.accountType === 'farmer' || this.accountType === 'salesRep')
    return this.regions.length <= 1;
  else
    return true;
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

// create stripe account
UserSchema.pre("save", function(next) {
  if (!this.isNew) return next();

  return stripe.customers
    .create({
      email: this.email,
      metadata: { database_id: this.id }
    })
    .then(stripeAcct => {
      this.stripe.customerId = stripeAcct.id;
      return next();
    })
    .catch(err => next(err));
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
    crops: this.crops,
    accountType: this.accountType,
    rating: this.rating,
    company: this.company
  };
};


UserSchema.methods.saveCard = function(card) {
  this.cards.push({
    _id: card.id,
    card_holder_name: card.name,
    brand: card.brand,
    exp: new Date(card.exp_year, card.exp_month - 1),
    funding: card.funding,
    last4: card.last4
  });

  return this.save().then(user => user.cards);
};

UserSchema.methods.deleteCard = function(cardId) {
  this.cards.pull(cardId);
  return this.save().then(user => user.cards);
};

UserSchema.methods.saveBank = function(bank) {
  this.banks.push({
    _id: bank.id,
    account_holder_name: bank.account_holder_name,
    bankName: bank.bank_name,
    routing: bank.routing_number,
    last4: bank.last4
  });

  return this.save().then(user => user.banks);
};

UserSchema.methods.deleteBank = function(bankAcctId) {
  this.banks.pull(bankAcctId);
  return this.save().then(user => user.banks);
};

UserSchema.methods.getCardsWithDefault = function() {
  let cards = this.cards;

  if (cards.length === 0) return Promise.resolve([]);
  else if (cards.length === 1) {
    cards[0] = cards[0].toObject();
    cards[0].default = true;
    return Promise.resolve(cards);
  }

  return stripe.customers
    .retrieve(this.stripe.customerId)
    .then(customer => {
      cards = cards.map(card => {
        if (card._id === customer.default_source) {
          card = card.toObject();
          card.default = true;
        }

        return card;
      });

      return cards;
    });
};

UserSchema.methods.getBanksWithDefault = function() {
  let banks = this.banks;

  if (banks.length === 0) return Promise.all([]);
  else if (banks.length === 1) {
    banks[0] = banks[0].toObject();
    banks[0].default = true;
    return Promise.all(banks);
  }

  return stripe.accounts
    .listExternalAccounts(this.stripe.connectId, {
      object: "bank_account"
    })
    .then(stripeBanks => {
      const defaultBankAcct = stripeBanks.data.filter(bankAcct => {
        return bankAcct.default_for_currency === true;
      })[0];

      banks = banks.map(bank => {
        if (defaultBankAcct && bank._id === defaultBankAcct.id) {
          bank = bank.toObject();
          bank.default = true;
        }

        return bank;
      });

      return banks;
    });
};

module.exports = mongoose.model("User", UserSchema);

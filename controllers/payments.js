'use strict';
"use strict";
const User = require("../models/user");
const stripe = require("../config/stripe");

const { NoDataError, NotAllowedError } = require("../errors");

// ============================ payment functions ============================ //

// add payment method
exports.addCard = (req, res, next) => {
  if (!req.body.token) return next(new NoDataError());

  const user = req.user;
  const token = req.body.token;
  const cards = user.cards;

  if (cards && cards.length >= 3)
    throw new NotAllowedError("Can only have 3 payment methods");

  return stripe.customers
    .createSource(user.stripe.customerId, { source: token })
    .then(card => {
      return Promise.all([
        user.saveCard(card),
        stripe.customers.update(user.stripe.customerId, {
          default_source: card.id
        })
      ]);
    })
    .then(([cards, customer]) => {
      cards = cards.map(card => {
        card = card.toObject();

        if (card._id === customer.default_source) card.default = true;

        return card;
      });

      return res.status(201).send(cards);
    })
    .catch(err => next(err));
};

// get all payment methods
exports.getAllCards = (req, res, next) => {
  return req.user
    .getCardsWithDefault()
    .then(cards => res.status(200).send(cards))
    .catch(err => next(err));
};

// set default payment method
exports.setDefaultCard = (req, res, next) => {
  if (!req.body.cardId) return next(new NoDataError());

  const user = req.user;
  const cardId = req.body.cardId;

  return stripe.customers
    .update(user.stripe.customerId, { default_source: cardId })
    .then(customer =>
      res.status(200).send({ defaultSource: customer.default_source })
    )
    .catch(err => next(err));
};

// delete payment method
exports.deleteCard = (req, res, next) => {
  const user = req.user;
  const cardId = req.params.cardId;

  return stripe.customers
    .deleteCard(user.stripe.customerId, cardId)
    .then(() =>
      Promise.all([
        user.deleteCard(cardId),
        stripe.customers.retrieve(user.stripe.customerId)
      ])
    )
    .then(([cards, customer]) => {
      cards = cards.map(card => {
        card = card.toObject();

        if (card._id === customer.default_source) card.default = true;

        return card;
      });

      return res.status(201).send(cards);
    })
    .catch(err => next(err));
};

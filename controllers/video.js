'use strict';
const Rating = require('../models/rating');

module.exports = {

  requestVideoChat: function(req, res, next) {
    const { locations, specialties } = req.body;


  },

  rateAgonomist: function(req, res, next) {
    const { chatId, rating } = req.body;

    // TODO: find chat

    const newRating = new Rating({
      rating,
      agronomist,
      user: req.user
    });

    return rating.save()
      .then(rating => res.status(200)).send({ success: true })
      .catch(err => next(err));
  }
}

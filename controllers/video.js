'use strict';
const Rating = require('../models/rating');

module.exports = {

  requestVideoChat: function(req, res, next) {
    const { region, specialty } = req.body;

    return User.aggregate([
      {
        $match: {
          accountType: "agronomist",
          regions: region,
          specialties: specialty
        }
      }
    ])
    .then(agronomists => {
      // TODO: send notif to all of them (maybe only top __ based on their rating)

      console.log(agronomists);
      return res.status(201).send(agronomists);
    })
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

'use strict';
const Rating = require('../models/rating');
const Chat = require('../models/chat');
const { NotAllowedError } = require('../errors');

// all functionality for video chats between agronomists and users
module.exports = {

  // TODO: test
  requestVideoChat: function(req, res, next) {
    const { region, crop } = req.body;

    return User.aggregate([
      {
        $match: {
          accountType: "agronomist",
          regions: region,
          crops: crop
        }
      }
    ])
    .then(agronomists => {
      // TODO: send notif to all of them (maybe only top __ based on their rating)

      console.log(agronomists);
      return res.status(201).send(agronomists);
    })
  },

  // TODO: test
  rateAgonomist: function(req, res, next) {
    const { chatId, rating } = req.body;
    const uid = req.user.id;

    return Chat.findById(chatId)
      .then(chat => {
        if (chat.agronomistRated)
          throw new NotAllowedError('Agronomist has already been rated for this chat');

        const newRating = new Rating({
          rating: rating,
          agronomist: chat.agronomist,
          user: uid
        });

        chat.agronomistRated = true;

        return Promise.all([newRating.save(), chat.save()])
      })
      .then(([rating, chat]) => res.status(200)).send({ success: true })
      .catch(err => next(err));
  }
}

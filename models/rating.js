'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  source: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  agronomist: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  }
})

RatingSchema.statics.getRating = function(uid) {
  return this.aggregate([
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
    console.log(ratingArr);
    return ratingArr[0] ? ratingArr[0].rating : null;
  });
}

// TODO: see if theres an easy way to grab ratings for multiple users
// should combine with the user aggregate in requestVideoChat
RatingSchema.statics.getAllRatings = function(uids) {
  uids = uids.map(uid => ObjectId(uid));

  return this.aggregate([
    { $match: { agronomist: { $in: uids } } },
    {
      $group: {
        _id: null,
        user: { rating: { $avg: "$rating" } }
      }
    },
    { $project: { user: true } }
  ])
  .then(ratingArr => {
    console.log(ratingArr);
  });
}

module.exports = mongoose.model("Rating", RatingSchema);

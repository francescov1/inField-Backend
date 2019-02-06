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

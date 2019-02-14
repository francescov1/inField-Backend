'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  agronomist: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  duration: Number,
  agronomistRated: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("Chat", ChatSchema);

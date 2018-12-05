'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PestSchema = new Schema({
  family: { type: String, required: true },
  genus: { type: String, required: true },
  cropsEffected: { type: String, required: true },
  treatment: { type: String, required: true },
  location: { type: String, required: true }
})

module.exports = mongoose.model('Pest', PestSchema);

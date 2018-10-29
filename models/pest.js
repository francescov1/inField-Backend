'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PestSchema = new Schema({
  species: { type: String, required: true },
  category: String,
  latinName: String
})

module.exports = mongoose.model('Pest', PestSchema)

'use strict';
const config = require('../config/main');
const Pest = require('../models/pest');
const rp = require('request-promise');
const { NoDataError } = require('../errors/custom');

module.exports = {

  addPest: function(req, res, next) {
    const pest = new Pest({
      family: req.body.family,
      genus: req.body.genus,
      cropsEffected: req.body.cropsEffected,
      treatment: req.body.treatment,
      location: req.body.location
    });

    return pest.save()
      .then(pest => res.status(201).send(pest))
      .catch(err => next(err));
  },

  classifyClickSpecies: async function(req, res, next) {
    if (!req.file)
      throw new NoDataError('No image provided');

    const options = {
      method: 'POST',
      uri: `${config.model.api_base_url}/beetles/click`,
      formData: {
        file: {
          value: req.file.buffer,
          options: {
            filename: 'image.jpg',
            contentType: 'image/jpg'
          }
        }
      },
      headers: { 'content-type': 'multipart/form-data' }
    };

    try {
      const species = await rp(options);
      return res.status(200).send({ prediction: species })
    }
    catch(err) {
      return next(err);
    }
  },

  classifyBeetleFamily: async function(req, res, next) {
    if (!req.file)
      throw new NoDataError('No image provided');

    const options = {
      method: 'POST',
      uri: `${config.model.api_base_url}/beetles/family`,
      formData: {
        file: {
          value: req.file.buffer,
          options: {
            filename: 'image.jpg',
            contentType: 'image/jpg'
          }
        }
      },
      headers: { 'content-type': 'multipart/form-data' }
    };

    try {
      const prediction = await rp(options);
      const pest = await Pest.findOne({ genus: prediction });
      return res.status(200).send({ prediction, pest });
    }
    catch(err) {
      return next(err);
    }
  }
};

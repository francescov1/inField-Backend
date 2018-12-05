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

  classifyClickSpecies: function(req, res, next) {
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

    return rp(options)
      .then(results => {

        // find bug in db

        return res.status(200).send({ prediction: results })
      })
      .catch(err => next(err));
  },

  classifyBeetleFamily: function(req, res, next) {
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

    return rp(options)
      .then(results => {

        // find bug in db

        return res.status(200).send({ prediction: results })
      })
      .catch(err => next(err));
  }
};

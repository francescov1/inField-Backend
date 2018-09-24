'use strict';
const config = require('../config/main');
const rp = require('request-promise');
const { NoDataError } = require('../errors/custom');

module.exports = {

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
      .then(results => res.status(200).send({ prediction: results }))
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
      .then(results => res.status(200).send({ prediction: results }))
      .catch(err => next(err));
  }
};

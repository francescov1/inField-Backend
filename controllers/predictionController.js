'use strict';
const config = require('../config/main');
const axios = require('axios');
const FormData = require('form-data');
const { NoDataError } = require('../errors/custom');

module.exports = {

  classifyClickSpecies: function(req, res, next) {
    if (!req.file)
      throw new NoDataError('No image provided');

    var formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: 'image.png'
    });

    return axios.post(`${config.model.api_base_url}/beetles/click`, formData, {
      headers: formData.getHeaders()
    })
    .then(results => res.status(200).send({ prediction: results.data }))
    .catch(err => {
      console.log(err)
      next(err)
    });

  },

  classifyBeetleFamily: function(req, res, next) {
    if (!req.file)
      throw new NoDataError('No image provided');

    var formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: 'image.png'
    });

    return axios.post(`${config.model.api_base_url}/beetles/family`, formData, {
      headers: formData.getHeaders()
    })
    .then(results => res.status(200).send({ prediction: results.data }))
    .catch(err => next(err));

  }

};

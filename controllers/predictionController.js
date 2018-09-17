'use strict';
const config = require('../config/main');
const axios = require('axios');
const FormData = require('form-data');
const { NoDataError } = require('../errors/custom');

module.exports = {

  classifyClickSpecies: function(req, res, next) {

  },

  classifyBeetleFamily: function(req, res, next) {
    if (!req.file)
      throw new NoDataError('No image provided');

    var formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: 'image.png'
    });

    return axios.post(`${config.model.api_base_url}/predict`, formData, {
      headers: formData.getHeaders()
    })
    .then(results => {
      return res.status(200).send({ prediction: results.data });
    })
    .catch(err => {
  //    console.log(err)
      next(err)
    });

  }

};

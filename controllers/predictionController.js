'use strict';

// TODO: everything

module.exports = {

  classifySpecies: function(req, res, next) {

  },

  classifyFamily: function(req, res, next) {
    console.log('families called, req.file: ');
    console.log(req.file)

    return res.status(200).send(req.file);
/*
    var formData = new FormData();
    formData.append('image', image);

    return axios.post(`${config.model.api_base_url}/predict`, formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(results => {
      console.log('success!')
      return res.status(200).send(results.data);
    })
    .catch(err => next(err));
  */
  }

};

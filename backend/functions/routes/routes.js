const util = require('util');
const express = require('express');
const watson = require('../watson-services.js');

var router = express.Router();


// classify an image
router.post('/classify', (req, res, next) => {
  const body = req.body;

  if (!body) {
    console.log('No image data found');
    return res.status(400).send({error: 'No image data found'});
  }

  return watson.classifyImage(body.image, body.classifierIds || ['default'], (err, results) => {
    if (err) {
      console.log('Error with Watson:\n' + err);
      return res.status(400).send({error: 'Error with Watson'});
    }
    
    return res.status(200).send(results);
  });

})

// get models
router.get('/classifiers', (req, res, next) => {

  watson.getClassifiers(true, (err, results) => {
    if (err) {
      console.log('Error with Watson:\n' + err);
      return res.status(400).send({error: 'Error with Watson'});
    }

    console.log(util.inspect(results, false, null));
    return res.status(200).send(results);
  });

})

// update model
router.put('/classifiers', (req, res, next) => {

})

// download CoreMlModel
router.get('/coreMlModels/:classifierId', (req, res, next) => {

})

module.exports = router;

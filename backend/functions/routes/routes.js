const util = require('util');
const express = require('express');
const watson = require('../watson-services.js');

var router = express.Router();


// classify an image
router.post('/classify', (req, res, next) => {
  const body = req.body;
  if (!body || (!body.imageUrl && !body.imageBase64))
    return next('No data');

  let image;
  if (body.imageUrl)
    image = body.imageUrl;
  else {
    // regex pattern to remove extra info from string
    const matches = body.imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (matches.length !== 3)
      return next('Image must be encoded in base64');

    image = new Buffer(matches[2], 'base64');
  }

  // log time to make image prediction
  console.time("watsonVisualRecognitionCall");

  return watson.classifyImage(image, body.classifierIds || ['default'], (err, results) => {

    console.timeEnd("watsonVisualRecognitionCall");

    if (err)
      return next(err);

    return res.status(200).send(results);
  });
})

// get models
router.get('/classifiers', (req, res, next) => {

  watson.getClassifiers(true, (err, results) => {

    if (err)
      return next(err);

    return res.status(200).send(results);
  });
})

// update model
router.put('/classifiers', (req, res, next) => {

  watson.updateModel(posClassNames, posFiles, negFiles, classifierId, (err, results) => {

    if (err)
      return next(err);

    return res.status(200).send(results);
  });
})

// download CoreMlModel
router.get('/coreMlModels/:classifierId', (req, res, next) => {

  watson.downloadCoreMlModel(classifierId, (err, results) => {

    if (err)
      return next(err);

    return res.status(200).send(results);
  });

})

module.exports = router;

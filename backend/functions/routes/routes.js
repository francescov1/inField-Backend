const express = require('express');
const multer = require('multer');
const upload = multer();

const watson = require('../watson-services.js');

var router = express.Router();

// classify an image
router.post('classify', upload.single('image'), (req, res, next) => {
  const body = req.body;
  const image = req.image;
  if (!image) {
    console.log('No image found');
    return;
  }
  if (!body || !body.classifierIds) {
    console.log('No classifier Ids found');
    return;
  }

  watson.classifyImage(image, body.classifierIds)
    .then(results => {
      console.log(util.inspect(results, false, null));
      return res.status(200).send(results);
    })
    .catch(err => {
      console.log('Error with Watson:\n' + err);
      return;
    });
})

// get models
router.get('classifiers', (req, res, next) => {

})

// update model
router.put('classifiers', (req, res, next) => {

})

// download CoreMlModel
router.get('coreMlModels/:classifierId', (req, res, next) => {

})

module.exports = router;

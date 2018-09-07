const util = require('util');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const spawn = require('child_process').spawn;

const express = require('express');
const watson = require('../watson-services.js');
var router = express.Router();

// classify an image
router.post('/classify', (req, res, next) => {

  const busboy = new Busboy({ headers: req.headers });
  let filePath;
  let model;
  let threshold;

  busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {

    if (filePath)
      file.resume();

    filePath = path.join(os.tmpdir(), fieldName);
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on('field', (fieldname, value, fieldnameTruncated, valueTruncated, encoding, mimetype) => {

    if (fieldname === 'threshold')
      threshold = value;
    else if (fieldname === 'model')
      model = value;
  });

  busboy.on('finish', () => {

    const image = fs.createReadStream(filePath);

    // log time to make image prediction
    console.time('predictionCall');

    // call python, return result
    const pythonProcess = spawn('python', [`${__dirname}/../test.py`, 1, 2, 3]);

    pythonProcess.stdout.on('data', (data) => {
      console.time('predictionCall')
      console.log('data from node: ' + data);
      return res.status(200).send({ data: data.toString() });
    });

    pythonProcess.stderr.on('data', (data) => next(data.toString()));
  });

  busboy.end(req.rawBody);
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
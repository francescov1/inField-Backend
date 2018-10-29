'use strict';
const predictionController = require('../controllers/predictionController');
const express = require('express');
const multer  = require('multer')
const upload = multer()
var predictionRouter = express.Router();

// upload pest test route
predictionRouter.post('/pest', predictionController.addPest);

predictionRouter.use(upload.single('image'));
predictionRouter.post('/beetles/family', predictionController.classifyBeetleFamily);
predictionRouter.post('/beetles/click', predictionController.classifyClickSpecies);

module.exports = predictionRouter;

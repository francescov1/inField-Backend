'use strict';
const predictionController = require('../controllers/predictionController');
const express = require('express');
const multer  = require('multer')
const upload = multer()
var predictionRouter = express.Router();

predictionRouter.use(upload.single('image'));
predictionRouter.post('/species', predictionController.classifySpecies);
predictionRouter.post('/families', predictionController.classifyFamily);

module.exports = predictionRouter;

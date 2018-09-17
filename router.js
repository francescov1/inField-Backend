'use strict';
const express = require('express');
const authController = require('./controllers/authenticationController');
const predictionRoutes = require('./routes/predictionRoutes');
const errorMiddleware = require('./errors/middleware');

module.exports = function(app) {

  // api router
  const apiRouter = express.Router();
  apiRouter.use('/predictions', predictionRoutes);

  // mount routers
  app.use('/api', authController.apiAuth, apiRouter);
  app.use('/', errorMiddleware);

  // if undefined route hit, show api landing page
  app.all('*', (req, res, next) => res.sendFile('api.html', { root: __dirname }));
};

'use strict';
const express = require('express');
const authController = require('./controllers/authenticationController');
const authRoutes = require("./routes/authenticationRoutes");
const predictionRoutes = require('./routes/predictionRoutes');
const errorMiddleware = require('./errors/middleware');

module.exports = function(app) {

  // api router
  const apiRouter = express.Router();
  apiRouter.use(authController.apiAuth)
  apiRouter.use('/predictions', predictionRoutes);

  // auth router
  const authRouter = express.Router();
  authRouter.use(authRoutes);

  // mount routers
  app.use('/api', apiRouter);
  app.use('/auth', authRouter);
  app.use('/', errorMiddleware);

  // if undefined route hit, show api landing page
  app.all('*', (req, res, next) => res.sendFile('api.html', { root: __dirname }));
};

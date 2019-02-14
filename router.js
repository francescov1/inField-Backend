'use strict';
const config = require('./config');
const express = require('express');
const rateLimit = require("express-rate-limit");
const authController = require('./controllers/authentication');
const authRoutes = require("./routes/authentication");
const userRoutes = require("./routes/users");
const videoRoutes = require("./routes/video");
const errorMiddleware = require('./errors/middleware');

module.exports = function(app) {
  // rate limiters
  const apiLimiter = rateLimit({
    windowMs: Number(config.rate_limit.api_window),
    max: Number(config.rate_limit.api_max),
    message: {
      type: "RateLimitError",
      message: "Too many requests, please try again later"
    }
  });
  const authLimiter = rateLimit({
    windowMs: Number(config.rate_limit.auth_window),
    max: Number(config.rate_limit.auth_max),
    message: {
      type: "RateLimitError",
      message: "Too many requests, please try again later"
    }
  });

  // api router
  const apiRouter = express.Router();
  apiRouter.use(apiLimiter);
  apiRouter.use(authController.apiAuth)
  apiRouter.use('/users', userRoutes);
  apiRouter.use('/videos', videoRoutes);

  // auth router
  const authRouter = express.Router();
  authRouter.use(authLimiter);
  authRouter.use(authRoutes);

  // mount routers
  app.use('/api', apiRouter);
  app.use('/auth', authRouter);
  app.use('/', errorMiddleware);

  // if undefined route hit, show api landing page
  app.all('*', (req, res, next) => res.sendFile('api.html', { root: __dirname }));
};

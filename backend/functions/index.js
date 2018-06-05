'use strict';
const functions = require('firebase-functions');

const bodyParser = require('body-parser');

const express = require('express');
const securityMiddleware = require('./middleware/security-middleware.js');
const routes = require('./routes/routes.js');
//const errorMiddleware = require('./middleware/error-middleware.js');
var app = express();

app.use(bodyParser.json());

app.use('/api', securityMiddleware);
app.use('/api', routes);
//app.use(errorMiddleware);

app.all('*', (req, res) => {
  return res.sendFile('api-landing-page.html', {root: __dirname })
})

exports.app = functions.https.onRequest((req, res, next) => {
	if (!req.path)
		req.url = `/${req.url}`

	return app(req, res, next);
});

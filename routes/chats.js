'use strict';
const controller = require('../controllers/chats');
const express = require('express');
const router = express.Router();

router.post('/', controller.requestVideoChat);
router.post('/rate', controller.rateAgonomist);

module.exports = router;

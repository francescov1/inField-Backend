"use strict";
const controller = require("../controllers/payments");
const express = require("express");
const router = express.Router();

router.post("/", controller.addCard);
router.get("/", controller.getAllCards);
router.post("/default", controller.setDefaultCard);
router.delete("/:cardId", controller.deleteCard);

module.exports = router;

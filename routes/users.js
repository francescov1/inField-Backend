"use strict";
const controller = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.get("/me", controller.getMe);
router.put("/me", controller.editMe);
router.post("/me/phone", controller.addPhone);
router.delete("/me/phone", controller.deletePhone);
router.post("/me/phone/verify", controller.verifyPhone);
router.post("/me/phone/resendVerification", controller.resendPhoneVerification);
router.delete("/me", controller.deleteMe);
router.get("/:uid", controller.getUser);
router.get("/search", controller.searchUsers);

router.post("/me/skills", controller.addSkills);
router.delete("/me/skills/regions", controller.removeRegion);
router.delete("/me/skills/specialties", controller.removeSpecialty);
router.get("/me/rating", controller.getRating);

module.exports = router;

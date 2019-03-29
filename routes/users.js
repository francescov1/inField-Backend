"use strict";
const controller = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.get("/me", controller.getMe);
router.put("/me", controller.editMe);
router.delete("/me", controller.deleteMe);
router.get("/:uid", controller.getUser);
router.get("/search", controller.searchUsers);

router.post("/me/skills", controller.addSkills);
router.delete("/me/skills/regions", controller.removeRegion);
router.delete("/me/skills/specialties", controller.removeSpecialty);

router.get("/skills/regions", controller.getAvailableRegions);
router.get("/skills/specialties", controller.getAvailableSpecialties);

module.exports = router;

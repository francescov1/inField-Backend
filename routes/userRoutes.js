"use strict";
const userController = require("../controllers/userController");
const express = require("express");
let userRouter = express.Router();

userRouter.get("/me", userController.getMe);
userRouter.put("/me", userController.editMe);
userRouter.post("/phone", userController.addPhone);
userRouter.delete("/me", userController.deleteMe);
userRouter.get("/:uid", userController.getUser);
userRouter.get("/search", userController.searchUsers);

module.exports = userRouter;

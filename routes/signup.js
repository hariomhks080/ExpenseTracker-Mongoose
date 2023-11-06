const path = require("path");

const express = require("express");
const controller = require("../controller/signup");
const router = express.Router();
router.get("/signup", controller.getsignup);
router.post("/signup/add-user", controller.postsignup);
router.get("/signup/add-user", controller.getpostsignup);
module.exports = router;

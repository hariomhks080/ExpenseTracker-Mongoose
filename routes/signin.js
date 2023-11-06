const path = require("path");
const express = require("express");
const controller = require("../controller/signin");
const router = express.Router();
router.get("/", controller.getsignin);
router.post("/signin/add-user", controller.postsignin);

module.exports = router;

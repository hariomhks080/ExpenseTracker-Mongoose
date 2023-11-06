const express = require("express");
const controller = require("../controller/password");
const userauthentician = require("../middleware/authetication");
const router = express.Router();
router.get("/forgetpasswordform", controller.getformforgetpassword);
router.post("/forget/password", controller.forgetpassword);
router.get("/password/reset/:id", controller.getresetform);
router.post("/password/reset", controller.resetpassword);
module.exports=router;
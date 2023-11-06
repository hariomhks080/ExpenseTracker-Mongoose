const express = require("express");
const controller = require("../controller/premiumfeature");
const userauthentician = require("../middleware/authetication");



const router = express.Router();
router.get("/expense/alladd-expense",userauthentician.authorization,controller.getAllexpense);
router.get("/premium/download",userauthentician.authorization,controller.downloadexpense);
router.get('/premium/downloadhistory',userauthentician.authorization,controller.getDownloadhistory);

module.exports=router;
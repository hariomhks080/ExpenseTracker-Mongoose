const express = require("express");
const controller = require("../controller/expense");
const userauthentician = require("../middleware/authetication");
const router = express.Router();
router.get("/expense", controller.getexpense);
router.post("/expense/add-expense",userauthentician.authorization,controller.postexpense);
router.get( "/expense/pagewise/alladd-expense",userauthentician.authorization,controller.getpagewiseexpense);
router.get( "/expense/report/add-expense",userauthentician.authorization,controller.getallexpense);

router.delete("/deleteuser/:productId",userauthentician.authorization,controller.postDeleteProduct);
module.exports = router;

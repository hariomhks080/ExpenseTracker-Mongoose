const path=require("path");
const express=require("express");
const controller=require("../controller/purchase")
const userauthentician=require("../middleware/authetication")
const router=express.Router();
router.get("/purchase/premiummembership",userauthentician.authorization,controller.purchasemembership)
router.post("/purchase/updatetransactionstatus",userauthentician.authorization,controller.updateTransactionStatus)
router.post("/purchase/failedtransactionstatus",userauthentician.authorization,controller.failedTransactionStatus)


module.exports=router;
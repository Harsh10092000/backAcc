import express from "express";
import {
    fetch,
    restrictAcc,
    addPayPLan,
    delPayPLan,
    updatePayPLan,
    fetchPayPlan,
    unrestrictAcc,
    addCoupon,
    fetchCoupon,
    delCoupon,
    updateCoupon,

    addHsnCode,
} from "../controllers/admin.js";
const router = express.Router();

router.get("/fetch", fetch);
router.put("/restrictAcc/:id" , restrictAcc);
router.put("/unrestrictAcc/:id" , unrestrictAcc);

// Pay plan
router.post("/addPayPLan", addPayPLan);
router.delete("/delPayPLan/:planId", delPayPLan);
router.put("/updatePayPLan" , updatePayPLan);
router.get("/fetchPayPlan" , fetchPayPlan);

// Coupon
router.post("/addCoupon" , addCoupon);
router.get("/fetchCoupon" , fetchCoupon);
router.delete("/delCoupon/:codeId", delCoupon);
router.put("/updateCoupon/" , updateCoupon);

// Hsn
router.post("/addHsnCode" , addHsnCode);
export default router;

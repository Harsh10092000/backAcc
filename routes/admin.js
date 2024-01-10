import express from "express";
import {
    verifyAdmin,

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
    fetchHsnCodes,
    fetchHsnCodeById,
    updateHsnCode,
    delHsnCode,

    fetchSacCodes,
    addSacCode,
    fetchSacCodeById,
    updateSacCode,
    delSacCode
} from "../controllers/admin.js";
const router = express.Router();

// admin
router.get("/verifyAdmin/:email", verifyAdmin);

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
router.get("/fetchHsnCodeById/:hsnId" , fetchHsnCodeById);
router.get("/fetchHsnCodes" , fetchHsnCodes);
router.put("/updateHsnCode/:hsnId" , updateHsnCode);
router.delete("/delHsnCode/:hsnId", delHsnCode);

//sac
router.get("/fetchSacCodes" , fetchSacCodes);
router.get("/fetchSacCodeById/:sacId" , fetchSacCodeById);
router.post("/addSacCode" , addSacCode);
router.put("/updateSacCode/:sacId" , updateSacCode);
router.delete("/delSacCode/:sacId", delSacCode);

export default router;

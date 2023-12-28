import express from "express";
import {
    fetch,
    restrictAcc,
    addPayPLan,
    delPayPLan,
    updatePayPLan,
    fetchPayPlan,
} from "../controllers/admin.js";
const router = express.Router();

router.get("/fetch", fetch);
router.put("/restrictAcc/:id" , restrictAcc);
router.post("/addPayPLan", addPayPLan);
router.delete("/delPayPLan/:planId", delPayPLan);
router.put("/updatePayPLan" , updatePayPLan);
router.get("/fetchPayPlan" , fetchPayPlan);
export default router;

import express from "express";
import {
    fetch,
    fetchdataById,
    sendData,
    updateData,
    delData,
    sendOtp
} from "../controllers/staff.js";
const router = express.Router();

router.get("/fetch/:accId/:uId", fetch);
router.get("/fetchdataById/:staffId" , fetchdataById);
router.post("/sendData" , sendData);
router.put("/updateData" , updateData);
router.delete("/delData/:staffId" , delData)
router.get("/sendOtp/:email" , sendOtp)
export default router;

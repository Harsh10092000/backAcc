import express from "express";
import { sendOtp, login } from "../controllers/auth.js";

const router = express.Router();

router.get("/sendmail/:email", sendOtp);
router.post("/checklog", login);
//router.get("/verifyOtp/:email/:cotp", verifyOtp);


export default router;

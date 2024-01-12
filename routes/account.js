import express from "express";
import { delData, fetchData, fetch, fetchStaffData, checkAcc,newUserLoginData, fetchAccessData } from "../controllers/account.js";
import multer from "multer";
import path from "path";
import { db } from "../connect.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/account");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage,
});

router.post(
  "/sendData",
  upload.fields([
    { name: "business", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("req.body : " , req.body);
    console.log("req.file : ",req.file);
    const q =
      "INSERT into business_account (`business_name`,`business_address`,`business_gst`,`business_type`,`business_nature`,`business_logo`,`business_signature`, `business_bank_acc`, `business_payee_name`, `business_acc_no`, `business_ifsc_code`, `user_id`, `access`) VALUES(?)";
    const values = [
      req.body.business_name,
      req.body.business_address,
      req.body.business_gst,
      req.body.business_type,
      req.body.business_nature,
      req.files.signature ? req.files.signature[0].filename : "",
      req.files.business ? req.files.business[0].filename : "",
      req.body.business_bank_name,
      req.body.business_payee_name,
      req.body.business_acc_no,
      req.body.business_ifsc_code,
      req.body.user_id,
      "1",
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.insertId);
    });
  }
);


router.put(
  "/updateAccData",
  upload.fields([
    { name: "business_logo", maxCount: 1 },
    { name: "business_signature", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("req.body : " , req.body);
    console.log("req.file : ",req.file);
    const q =
    "UPDATE business_account SET business_name = ? , business_address = ?, business_gst = ?, business_type = ?, business_nature = ? , business_logo = ? , business_signature = ?, business_bank_acc = ?, business_acc_no = ?, business_ifsc_code = ?, business_payee_name = ? WHERE business_id = ?";
    const values = [
      req.body.business_name,
      req.body.business_address,
      req.body.business_gst,
      req.body.business_type,
      req.body.business_nature,
      req.files.business_signature ? req.files.business_signature[0].filename : req.body.business_signature !== "" ? req.body.business_signature : "",
      req.files.business_logo ? req.files.business_logo[0].filename : req.body.business_logo !== "" ? req.body.business_logo : "",
      req.body.business_bank_acc,
      req.body.business_acc_no,
      req.body.business_ifsc_code,
      req.body.business_payee_name,
      req.body.business_id,
    ];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Updated ");
    });
  }
);

router.get("/fetchData/:accId", fetchData);
router.delete("/delData/:accId", delData);
router.get("/fetch/:uId",fetch);
router.get("/fetchStaffData/:uId",fetchStaffData);

router.get("/checkAcc/:uId",checkAcc);
router.get("/newUserLoginData/:email" , newUserLoginData);
router.get("/fetchAccessData/:accId" , fetchAccessData);
export default router;

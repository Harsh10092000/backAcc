import express from "express";
import {
  sendData,
  fetchData,
  fetchTran,
  fetchAll,
  deleteCustomer,
  updateCustomer,
  fetchCustomerData,
  //updateTran,
  fetchTranid,
  deleteTran,
  fetchDataUsingId,
  fetchLastTran,
  fetchTotal,
} from "../controllers/customer.js";
import multer from "multer";
import path from "path";
import { db } from "../connect.js";
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
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
router.post("/send", sendData);
router.get("/fetch/:accId", fetchData);
router.post("/sendTran", upload.single("image"), (req, res) => {
  console.log("req.body : ", req.body);
  console.log("req.file : ", req.file);
  const q =
    "INSERT INTO customer_tran(`tran_pay`,`tran_receive`,`tran_description`,`tran_date`,`cnct_id`,`tran_bill` ) VALUES(?)";
  const values = [
    req.body.tran_pay,
    req.body.tran_receive,
    req.body.tran_description,
    req.body.tran_date,
    req.body.cnct_id,
    req.file ? req.file.filename : "",
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Transaction has been Entered");
  });
});
router.get("/fetchTran/:id", fetchTran);
router.get("/fetchAll", fetchAll);
router.post("/delcust/:userId", deleteCustomer);
router.put("/updatecust/:custid", updateCustomer);
router.get("/fetchCust/:custId", fetchCustomerData);

//router.put("/updateTran/:tranId", updateTran);
router.put("/updateTran/:tranId", upload.single("image"), (req, res) => {
  const q =
    "UPDATE customer_tran SET tran_pay = ?, tran_receive = ? , tran_description = ? , tran_date = ? , tran_bill = ? where tran_id = ?";
  console.log("req.body : ", req.body);
  console.log("req.file : ", req.file);
  const values = [
    req.body.tran_pay,
    req.body.tran_receive,
    req.body.tran_description,
    req.body.tran_date,

    req.file ? req.file.filename : "",
    req.params.tranId,
  ];
  console.log("values : ", values);
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
});

router.delete("/deleteTran/:tran_id", deleteTran);
router.get("/fetchDataUsingId/:user_id", fetchDataUsingId);
router.get("/fetchTranid/:tid", fetchTranid);
router.get("/fetchLastTran/:cnct_id", fetchLastTran);
router.get("/fetchTotal/:accId", fetchTotal);

export default router;

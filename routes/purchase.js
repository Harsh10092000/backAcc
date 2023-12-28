import express from "express";
import {
  fetchData,
  fetchDataById,
  fetchPurchaseTran,
  delPurchase,
  addPurchase,
  updateProductStockQty,
  addPurchasePayment,

  fetchPurchasePrefixData,
  fetchPurchasePayPrefixData,
  //updateBalanceDue,

  invoiceItemList,
  updatePurchase,
  deletePurchaseUserAddedItemList,
  insertPurchaseUserAddedItemList,
  fetchFirstPayOutId,

  updatePurchaseUnpaidTran,
  addPurchasePayOutTran,
  delPayOut,

  fetchDataByIdAndPayOutId,
  
  updatePurchaseItems,
  deletePurchaseItems,
  updatePurchaseModuleTran,

  fetchPurchaseReturnPrefixData,
  returnPurchase,
  delPurchaseReturn,
} from "../controllers/purchase.js";


const router = express.Router();

router.post("/addPurchasePayment", addPurchasePayment);
router.post("/addPurchase", addPurchase);
router.put("/updateProductStockQty" , updateProductStockQty);
router.get("/fetchData/:accId", fetchData);
router.get("/fetchDataById/:purchaseId", fetchDataById);
router.get("/fetchDataByIdAndPayOutId/:purchaseId", fetchDataByIdAndPayOutId);
router.get("/fetchPurchaseTran/:purchaseId", fetchPurchaseTran);
router.delete("/delPurchase/:purchaseId", delPurchase);

router.get("/fetchPurchasePayPrefixData/:accId", fetchPurchasePayPrefixData);
router.get("/fetchPurchasePrefixData/:accId", fetchPurchasePrefixData);
//router.put("/updateBalanceDue" , updateBalanceDue);
router.get("/invoiceItemList/:purchaseId/:accId", invoiceItemList);
router.put("/updatePurchase" , updatePurchase);
router.delete("/deletePurchaseUserAddedItemList/:purchaseId" , deletePurchaseUserAddedItemList)
router.post("/insertPurchaseUserAddedItemList" , insertPurchaseUserAddedItemList)
router.get("/fetchFirstPayOutId/:purchasePayOutId", fetchFirstPayOutId);

router.post("/addPurchasePayOutTran" , addPurchasePayOutTran);
router.put("/updatePurchaseUnpaidTran" , updatePurchaseUnpaidTran);
router.delete("/delPayOut/:purchaseId" , delPayOut)

router.post("/updatePurchaseItems" , updatePurchaseItems);
router.delete("/deletePurchaseItems/:purchaseId" , deletePurchaseItems);
router.put("/updatePurchaseModuleTran" , updatePurchaseModuleTran);

router.get("/fetchPurchaseReturnPrefixData/:accId" , fetchPurchaseReturnPrefixData);
router.post("/returnPurchase" , returnPurchase);
router.delete("/delPurchaseReturn/:purchaseId" , delPurchaseReturn);
export default router;


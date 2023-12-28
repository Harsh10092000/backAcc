import express from "express";
import {
  fetchData,
  fetchDataById,
  addSales,
  fetchSaleTran,
  delSales,
  fetchSalesPrefixData,
  updateProductStockQty,
  updateServicesSalesQty, 
  addSalePayment,
  fetchPaymentPrefixData,
  updateBalanceDue,

  fetchDataByIdAndPaymentInId,
  updateSale,
  delPayIn,

  invoiceProItemList,
  invoiceSerItemList,

  updateSaleItems,
  deleteSaleItems,
  updateSaleModuleTran,

  returnSale,
  fetchSaleReturnPrefixData,
  delSaleReturn,
} from "../controllers/sales.js";


const router = express.Router();

router.post("/addSalePayment", addSalePayment);
router.post("/addSales", addSales);
router.get("/fetchData/:accId", fetchData);
router.get("/fetchDataById/:saleId", fetchDataById);
router.get("/fetchSaleTran/:saleId", fetchSaleTran);
router.delete("/delSales/:saleId", delSales);
router.get("/fetchSalesPrefixData/:accId", fetchSalesPrefixData);
router.put("/updateProductStockQty" , updateProductStockQty);
router.put("/updateServicesSalesQty" , updateServicesSalesQty);
router.get("/fetchPaymentPrefixData/:accId", fetchPaymentPrefixData);
router.put("/updateBalanceDue" , updateBalanceDue);

router.get("/fetchDataByIdAndPaymentInId/:saleId" , fetchDataByIdAndPaymentInId);
router.put("/updateSale", updateSale);
router.delete("/delPayIn/:saleId" , delPayIn);


router.get("/invoiceProItemList/:saleId/:accId", invoiceProItemList);
router.get("/invoiceSerItemList/:saleId/:accId", invoiceSerItemList);

router.post("/updateSaleItems" , updateSaleItems);
router.delete("/deleteSaleItems/:saleId" , deleteSaleItems);
router.put("/updateSaleModuleTran" , updateSaleModuleTran);

router.get("/fetchSaleReturnPrefixData/:accId" , fetchSaleReturnPrefixData);
router.post("/returnSale" , returnSale);

router.delete("/delSaleReturn/:saleId" , delSaleReturn);

export default router;

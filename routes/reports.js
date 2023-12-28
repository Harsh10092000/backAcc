// import express from "express";
// import {
//   fetchBoth,
//   fetchCash,
//   fetchSales,
//   fetchSup,
// } from "../controllers/reports.js";

// const router = express.Router();

// router.get("/fetchBoth", fetchBoth);
// router.get("/fetchSupBoth", fetchSup);
// router.get("/fetchCash", fetchCash);
// router.get("/fetchSale", fetchSales);
// export default router;

import express from "express";
import {
  fetchBoth,
  fetchCash,
  fetchSales,
  fetchSup,
  fetchPurchase,
} from "../controllers/reports.js";

const router = express.Router();

router.get("/fetchBoth/:accId", fetchBoth);
router.get("/fetchSupBoth/:accId", fetchSup);
router.get("/fetchCash/:accId", fetchCash);
router.get("/fetchSale/:accId", fetchSales);
router.get("/fetchPurchase/:accId", fetchPurchase);

export default router;
import express from "express";
import {
  fetchExpenseCategory,
  addExpenseCategory,
  fetchExpenseList,
  addExpenseList,
  delExpenseItemFromList,
  updateExpenseItemData,
  delExpenseCategory,
  updateExpenseCategoryData,
  addExpenses,
  fetchExpensesData,
  fetchExpensesPrefixData,
  fetchExpensesRightTran,
  fetchExpensesTran,
  delexpenses,

  // edit expenses
  updateExpenses,
  fetchExpensesUserAddedItemList,
  DeleteExpensesUserAddedItemList,
  UpdateExpensesUserAddedItemList,
  updateCash,

  // test1

} from "../controllers/expenses.js";
const router = express.Router();

router.get("/fetchExpenseCategory/:accId", fetchExpenseCategory);
router.get("/fetchExpenseList/:accId", fetchExpenseList);
router.post("/addExpenseCategory", addExpenseCategory);
router.post("/addExpenseList", addExpenseList);
router.delete("/delExpenseItemFromList/:eiid", delExpenseItemFromList);
router.put("/updateExpenseItemData/:eiid", updateExpenseItemData);
router.delete("/delExpenseCategory/:ecid", delExpenseCategory);
router.put("/updateExpenseCategoryData/:ecid", updateExpenseCategoryData);

router.post("/addExpenses", addExpenses);
router.get("/fetchExpensesData/:accId", fetchExpensesData);
router.get("/fetchExpensesPrefixData/:accId", fetchExpensesPrefixData);
router.get("/fetchExpensesRightTran/:expId", fetchExpensesRightTran);
router.get("/fetchExpensesTran/:expId", fetchExpensesTran);
router.delete("/delexpenses/:expId", delexpenses);

router.get("/fetchExpensesUserAddedItemList/:cnct_Id1/:accId/:cnct_Id2", fetchExpensesUserAddedItemList);
router.delete("/DeleteExpensesUserAddedItemList/:expId",DeleteExpensesUserAddedItemList);
router.put("/updateExpenses/:expId",updateExpenses);
router.post("/UpdateExpensesUserAddedItemList",UpdateExpensesUserAddedItemList)

router.put("/updateCash/:expId",updateCash);

// const router = express.Router();
// router.post("/test1",test1)

export default router;

const express = require("express");
const router = express.Router();
const {
  addMoney,
  withdrawMoney,
  getCustomerTransactions,
  adminTransactionList,
  adminPendingTransactionList,
  approveTransaction,
  rejectTransaction,
  adminFailedTransactionList,
  adminWithdrawPendingTransactionList,
} = require("../controllers/transactionController");

router.post("/add", addMoney);
router.post("/withdraw", withdrawMoney);
router.get("/:customerId", getCustomerTransactions);
router.post("/filter", adminTransactionList);
router.post("/pending", adminPendingTransactionList);
router.post("/:id/approve", approveTransaction);
router.post("/:id/reject", rejectTransaction);
router.post("/failed", adminFailedTransactionList);
router.post("/w/pending", adminWithdrawPendingTransactionList);

module.exports = router;

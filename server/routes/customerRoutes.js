const express = require("express");
const router = express.Router();
const {
  register,
  login,
  changePassword,
  getWalletBalance,
  adminCustomerList,
} = require("../controllers/customerController");

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", changePassword);
router.get("/wallet/:id", getWalletBalance);
router.post("/filter", adminCustomerList);

module.exports = router;

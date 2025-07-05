const express = require("express");
const router = express.Router();
const {
  placeBet,
  seedCustomersAndBets,
  getMatkaReport,
  getMatkaCombineReport,
  getCustomerBet,
} = require("../controllers/betController");

router.post("/place", placeBet);
router.post("/seed", seedCustomersAndBets);
router.get("/report/:matkaId", getMatkaReport);
router.get("/combine-report/:matkaId", getMatkaCombineReport);
router.get("/customer-bet/:customerId", getCustomerBet);

module.exports = router;

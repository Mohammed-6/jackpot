const express = require("express");
const {
  triggerWinning,
  getAllWinnings,
  getLastTenWinnings,
} = require("../controllers/winningController.js");

const router = express.Router();

router.post("/trigger", triggerWinning);
router.get("/list", getAllWinnings);
router.get("/last", getLastTenWinnings);

module.exports = router;

const express = require("express");
const router = express.Router();
const matkaController = require("../controllers/matkaController");

router.post("/", matkaController.createMatka);
router.get("/", matkaController.getAllMatkas);
router.get("/:id", matkaController.getMatkaById);
router.put("/:id", matkaController.updateMatka);
router.delete("/:id", matkaController.deleteMatka);
router.get("/mt", matkaController.getAllMatkas); // for frontend users

module.exports = router;

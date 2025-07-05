// routes/teamRoutes.js
const express = require("express");
const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");

const router = express.Router();

router.post("/", createTeamMember);
router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMemberById);
router.post("/:id", updateTeamMember);
router.delete("/:id", deleteTeamMember);

module.exports = router;

// controllers/teamController.js
const { TeamModel } = require("../models/team");
const bcrypt = require("bcrypt");

exports.createTeamMember = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existing = await TeamModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newMember = new TeamModel({ name, email, phone, password, role });
    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error creating team member", error });
  }
};

exports.getAllTeamMembers = async (req, res) => {
  try {
    const team = await TeamModel.find().populate("role", "_id name");
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team members", error });
  }
};

exports.getTeamMemberById = async (req, res) => {
  try {
    const team = await TeamModel.findById(req.params.id).populate("role");
    if (!team)
      return res.status(404).json({ message: "Team member not found" });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team member", error });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const updateData = { name, email, phone, role };

    if (password) {
      // Only hash if password is provided
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await TeamModel.findByIdAndUpdate(req.params.id, {
      $set: updateData,
    });
    const team = await TeamModel.findById(req.params.id).populate(
      "role",
      "_id name"
    );
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Error updating team member", error });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team member deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team member", error });
  }
};

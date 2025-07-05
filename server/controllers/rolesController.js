const { RoleModel } = require("../models/role.js");

// CREATE a new role
const createRole = async (req, res) => {
  try {
    const data = req.body;
    delete data._id;
    const savedRole = await RoleModel.create(data);
    res.status(201).json(savedRole);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one role
const getRoleById = async (req, res) => {
  try {
    const role = await RoleModel.findById(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE a role
const updateRole = async (req, res) => {
  try {
    const updated = await RoleModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Role not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a role
const deleteRole = async (req, res) => {
  try {
    const deleted = await RoleModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};

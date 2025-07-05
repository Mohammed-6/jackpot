const Matka = require("../models/matkaModel");

// CREATE
exports.createMatka = async (req, res) => {
  try {
    const matka = await Matka.create(req.body);
    res.status(201).json(matka);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getAllMatkas = async (req, res) => {
  try {
    const matkas = await Matka.find();
    res.json(matkas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getMatkaById = async (req, res) => {
  try {
    const matka = await Matka.findById(req.params.id);
    if (!matka) return res.status(404).json({ message: "Matka not found" });
    res.json(matka);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateMatka = async (req, res) => {
  try {
    const matka = await Matka.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!matka) return res.status(404).json({ message: "Matka not found" });
    res.json(matka);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteMatka = async (req, res) => {
  try {
    const matka = await Matka.findByIdAndDelete(req.params.id);
    if (!matka) return res.status(404).json({ message: "Matka not found" });
    res.json({ message: "Matka deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

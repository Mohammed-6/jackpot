const { TeamModel } = require("../models/team");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "userInformation"; // Replace this with env variable in production

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await TeamModel.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: "Registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await TeamModel.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });

    const userObj = await TeamModel.findOne({ email }).select(
      "name email _id role phone"
    );
    res.status(200).json({ token, user: userObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

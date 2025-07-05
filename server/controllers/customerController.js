const bcrypt = require("bcryptjs");
const Customer = require("../models/customer");
const Winning = require("../models/winning");

exports.register = async (req, res) => {
  try {
    const { name, phone, password, referredBy } = req.body;

    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      phone,
      password: hashedPassword,
      referredBy: referredBy || null,
    });

    await newCustomer.save();

    return res.status(201).json({
      message: "Customer registered successfully",
      referralCode: newCustomer.referralCode,
      customerId: newCustomer.customerId,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return res.status(200).json({
      message: "Login successful",
      customerId: customer.customerId,
      customer: customer._id,
      wallet: customer.walletMoney,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  const { customerId, oldPassword, newPassword } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const isMatch = await bcrypt.compare(oldPassword, customer.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedNewPassword;
    await customer.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWalletBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id).select("walletMoney");
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json({ walletMoney: customer.walletMoney });
  } catch (err) {
    console.error("Error getting wallet balance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminCustomerList = async (req, res) => {
  const { name, phone, customerId, page = 1, limit = 10 } = req.body;
  const query = {};

  if (name) query.name = { $regex: name, $options: "i" };
  if (phone) query.phone = { $regex: phone, $options: "i" };
  if (customerId) query._id = customerId;

  try {
    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, customers });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

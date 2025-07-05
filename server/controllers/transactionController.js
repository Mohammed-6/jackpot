const Transaction = require("../models/transaction");
const Customer = require("../models/customer");

exports.addMoney = async (req, res) => {
  try {
    const { customerId, amount } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    customer.walletMoney += Number(amount);
    await customer.save();

    const transaction = new Transaction({
      customerId,
      type: "credit",
      amount,
    });

    await transaction.save();
    res
      .status(200)
      .json({ message: "Money added", walletMoney: customer.walletMoney });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.withdrawMoney = async (req, res) => {
  try {
    const { customerId, amount } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    if (customer.walletMoney < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    customer.walletMoney -= Number(amount);
    await customer.save();

    const transaction = new Transaction({
      customerId,
      type: "debit",
      amount,
    });

    await transaction.save();
    res.status(200).json({
      message: "Withdrawal successful",
      walletMoney: customer.walletMoney,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCustomerTransactions = async (req, res) => {
  const { customerId } = req.params;

  try {
    const transactions = await Transaction.find({
      customerId,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(transactions);
  } catch (err) {
    console.error("Transaction fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminTransactionList = async (req, res) => {
  const { type, phone, customerId, page = 1, limit = 10 } = req.body;
  const query = {};

  try {
    const matchQuery = {};

    if (type) matchQuery.type = { $regex: type, $options: "i" };

    matchQuery.status = "completed";
    // If filtering by customer details, first fetch customer IDs
    if (phone || customerId) {
      const customerQuery = {};
      if (phone) customerQuery.phone = { $regex: phone, $options: "i" };
      if (customerId) customerQuery.customerId = customerId;

      const customers = await Customer.find(customerQuery).select("_id");
      const customerIds = customers.map((c) => c._id);
      matchQuery.customerId = { $in: customerIds };
    }

    const total = await Transaction.countDocuments(matchQuery);
    const transactions = await Transaction.find(matchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

exports.adminPendingTransactionList = async (req, res) => {
  const { type, phone, customerId, page = 1, limit = 10 } = req.body;
  const query = {};

  try {
    const matchQuery = {};

    if (type) matchQuery.type = { $regex: type, $options: "i" };

    matchQuery.status = "pending";
    matchQuery.type = "credit";
    // If filtering by customer details, first fetch customer IDs
    if (phone || customerId) {
      const customerQuery = {};
      if (phone) customerQuery.phone = { $regex: phone, $options: "i" };
      if (customerId) customerQuery.customerId = customerId;

      const customers = await Customer.find(customerQuery).select("_id");
      const customerIds = customers.map((c) => c._id);
      matchQuery.customerId = { $in: customerIds };
    }

    const total = await Transaction.countDocuments(matchQuery);
    const transactions = await Transaction.find(matchQuery)
      .populate("customerId", "name phone customerId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

exports.approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    const customer = await Customer.findById(transaction.customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    transaction.status = "completed"; // Add `status` field if not already present
    await transaction.save();

    if (transaction.type === "credit") {
      customer.walletMoney += Number(transaction.amount);
      await customer.save();
    } else if (transaction.type === "debit") {
      customer.walletMoney -= Number(transaction.amount);
      await customer.save();
    }

    res.json({ message: "Transaction approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    transaction.status = "failed";
    await transaction.save();

    res.json({ message: "Transaction rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminFailedTransactionList = async (req, res) => {
  const { type, phone, customerId, page = 1, limit = 10 } = req.body;
  const query = {};

  try {
    const matchQuery = {};

    if (type) matchQuery.type = { $regex: type, $options: "i" };

    matchQuery.status = "failed";
    // If filtering by customer details, first fetch customer IDs
    if (phone || customerId) {
      const customerQuery = {};
      if (phone) customerQuery.phone = { $regex: phone, $options: "i" };
      if (customerId) customerQuery.customerId = customerId;

      const customers = await Customer.find(customerQuery).select("_id");
      const customerIds = customers.map((c) => c._id);
      matchQuery.customerId = { $in: customerIds };
    }

    const total = await Transaction.countDocuments(matchQuery);
    const transactions = await Transaction.find(matchQuery)
      .populate("customerId", "name phone customerId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

exports.adminWithdrawPendingTransactionList = async (req, res) => {
  const { type, phone, customerId, page = 1, limit = 10 } = req.body;
  const query = {};

  try {
    const matchQuery = {};

    if (type) matchQuery.type = { $regex: type, $options: "i" };

    matchQuery.status = "pending";
    matchQuery.type = "debit";
    // If filtering by customer details, first fetch customer IDs
    if (phone || customerId) {
      const customerQuery = {};
      if (phone) customerQuery.phone = { $regex: phone, $options: "i" };
      if (customerId) customerQuery.customerId = customerId;

      const customers = await Customer.find(customerQuery).select("_id");
      const customerIds = customers.map((c) => c._id);
      matchQuery.customerId = { $in: customerIds };
    }

    const total = await Transaction.countDocuments(matchQuery);
    const transactions = await Transaction.find(matchQuery)
      .populate("customerId", "name phone customerId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

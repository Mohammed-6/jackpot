const Customer = require("../models/customer");
const Transaction = require("../models/transaction");
const Matka = require("../models/matkaModel");
const Bet = require("../models/bet");
const bcrypt = require("bcrypt");
const names = require("../utils/names.json");

exports.placeBet = async (req, res) => {
  const { customerId, gameId, numbers, amount } = req.body;

  if (!customerId || !Array.isArray(numbers) || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid data provided" });
  }

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.walletMoney < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct amount
    customer.walletMoney -= amount;
    await customer.save();

    // Create bet
    req.body.selected.forEach(async (data, i) => {
      const bet = new Bet({
        customerId: customer._id,
        numbers: [data.number],
        gameId,
        amount: data.amount,
        // totalPoints: amount,
      });
      await bet.save();
      // Create transaction
      const txn = new Transaction({
        customerId: customer._id,
        amount: data.amount,
        type: "bet",
        betNumber: data.number,
      });
      await txn.save();
    });

    res.json({
      message: "Bet placed successfully",
      walletBalance: customer.walletMoney,
    });
  } catch (err) {
    console.error("Place Bet Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

function generateFakeMobileNumber() {
  const prefixes = ["6", "5", "4"]; // Valid starting digits for Indian mobiles
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const restDigits = Math.floor(100000000 + Math.random() * 900000000); // 9 digits

  return randomPrefix + restDigits.toString();
}

exports.seedCustomersAndBets = async (req, res) => {
  const numberOfCustomers = parseInt(req.body.count || 10);
  const defaultPassword = await bcrypt.hash("123456", 10);
  const depositAmount = 10000;
  const betsPerCustomer = 10;

  try {
    for (let i = 0; i < numberOfCustomers; i++) {
      const name = names[Math.floor(Math.random() * names.length)];

      const phone = generateFakeMobileNumber(); // Unique phone numbers
      const customer = await Customer.create({
        name,
        phone,
        password: defaultPassword,
        walletMoney: depositAmount,
        userType: 2,
      });

      // Add initial deposit transaction
      //   await Transaction.create({
      //     customerId: customer._id,
      //     type: "credit",
      //     amount: depositAmount,
      //   });

      for (let j = 0; j < betsPerCustomer; j++) {
        const betAmount = Math.floor(Math.random() * 900 + 100); // 100–999

        // Make sure wallet has enough
        if (customer.walletMoney >= betAmount) {
          // Deduct wallet
          customer.walletMoney -= betAmount;
          await customer.save();

          const random = Math.floor(Math.random() * 10) + 1;
          const random1 = Math.floor(Math.random() * 10) + 1;
          const random2 = Math.floor(Math.random() * 10) + 1;
          // Save bet
          await Bet.create({
            customerId: customer._id,
            numbers: [random],
            gameId: req.body.gameId,
            amount: betAmount,
            // totalPoints: betAmount,
          });
          await Bet.create({
            customerId: customer._id,
            numbers: [random1],
            gameId: req.body.gameId,
            amount: betAmount,
            // totalPoints: betAmount,
          });
          await Bet.create({
            customerId: customer._id,
            numbers: [random2],
            gameId: req.body.gameId,
            amount: betAmount,
            // totalPoints: betAmount,
          });

          // Save transaction
          //   await Transaction.create({
          //     customerId: customer._id,
          //     type: "bet",
          //     amount: betAmount,
          //   });
        }
      }
    }

    res
      .status(200)
      .json({ message: "Customers and bets created successfully" });
  } catch (err) {
    console.error("Error seeding data:", err);
    res.status(500).json({ message: "Failed to seed customers and bets" });
  }
};

exports.getMatkaReport = async (req, res) => {
  try {
    const { matkaId } = req.params;
    // Fetch any one matka to get rangeFrom, rangeTo for this matka
    const matkaData = await Matka.findById(matkaId);
    if (!matkaData) return res.status(404).json({ message: "No matka found" });

    const { rangeFrom = 0, rangeTo = 99 } = matkaData;

    const bets = await Bet.find({
      gameId: matkaId,
      $or: [{ showDown: false }, { showDown: { $exists: false } }],
    }).populate("customerId");

    // Create initial range report object
    const report = {};
    for (let i = rangeFrom; i <= rangeTo; i++) {
      report[i] = {
        realTotal: 0,
        realUsers: [],
      };
    }

    // Aggregate real users only
    bets.forEach((bet) => {
      const { numbers = [], amount = 0, customerId } = bet;
      const userType = customerId?.userType ?? 2;

      if (userType !== 0) return; // Skip dummy users

      numbers.forEach((num) => {
        if (report[num]) {
          report[num].realUsers.push(amount);
          report[num].realTotal += amount;
        }
      });
    });

    // Total collected from real users
    const totalCollected = Object.values(report).reduce(
      (sum, item) => sum + item.realTotal,
      0
    );

    const payoutMultiplier = matkaData.dealType;
    const profitReport = {};

    // Calculate profits
    Object.entries(report).forEach(([num, data]) => {
      const payout = data.realTotal * payoutMultiplier;
      const profit = totalCollected - payout;

      profitReport[num] = {
        ...data,
        payout,
        profit,
      };
    });

    // Find most profitable number
    const best = Object.entries(profitReport).reduce(
      (max, [num, data]) =>
        data.profit > max.data.profit ? { num, data } : max,
      { num: null, data: { profit: -Infinity } }
    );

    return res.json({
      rangeFrom,
      rangeTo,
      totalCollected,
      bestNumber: best.num,
      bestProfit: best.data.profit,
      payoutMultiplier,
      profitReport,
    });
    res.json({ rangeFrom, rangeTo, report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMatkaCombineReport = async (req, res) => {
  try {
    const { matkaId } = req.params;
    // Fetch any one matka to get rangeFrom, rangeTo for this matka
    const matkaData = await Matka.findById(matkaId);
    if (!matkaData) return res.status(404).json({ message: "No matka found" });

    const { rangeFrom = 0, rangeTo = 99 } = matkaData;

    const bets = await Bet.find({
      gameId: matkaId,
      $or: [{ showDown: false }, { showDown: { $exists: false } }],
    })
      .populate("customerId", "name userType")
      .lean();

    const report = {};

    for (let i = rangeFrom; i <= rangeTo; i++) {
      report[i] = {
        number: i,
        realUsers: [],
        dummyUsers: [],
        realTotal: 0,
        dummyTotal: 0,
      };
    }

    bets.forEach((bet) => {
      const { numbers = [], amount = 0, customerId } = bet;
      const userType = customerId?.userType ?? 2;

      numbers.forEach((num) => {
        if (num in report) {
          if (userType === 2) {
            report[num].dummyTotal += amount;
          } else {
            report[num].realTotal += amount;
          }
        }
      });
    });

    res.json({ rangeFrom, rangeTo, report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCustomerBet = async (req, res) => {
  const { customerId } = req.params;

  try {
    const bets = await Bet.find({
      customerId,
    })
      .populate("gameId", "betName")
      .sort({ createdAt: -1 })
      .lean();

    res.json(bets);
  } catch (err) {
    console.error("Transaction fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

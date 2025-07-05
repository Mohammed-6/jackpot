const Transaction = require("../models/transaction");
const Customer = require("../models/customer");
const Bet = require("../models/bet");
const Winning = require("../models/winning.js");
const Matka = require("../models/matkaModel");

exports.triggerWinning = async (req, res) => {
  const { matkaId, winningNumber } = req.body;

  try {
    const matkaData = await Matka.findById(matkaId);
    if (!matkaData) return res.status(404).json({ message: "No matka found" });

    const dummyBets = await Bet.find({
      gameId: matkaId,
      showDown: false,
    }).populate("customerId");

    const affectedDummyUserIds = [
      ...new Set(
        dummyBets
          .filter((bet) => bet.customerId?.userType === 2)
          .map((bet) => bet.customerId._id.toString())
      ),
    ];

    await Bet.deleteMany({
      gameId: matkaId,
      customerId: { $in: affectedDummyUserIds },
    });
    await Customer.deleteMany({ _id: { $in: affectedDummyUserIds } });

    const winningBets = await Bet.find({
      gameId: matkaId,
      showDown: false,
      numbers: { $in: [winningNumber] },
    }).populate("customerId");

    let totalBetAmount = 0;
    let totalPaidOut = 0;

    const betDetails = [];

    for (const bet of winningBets) {
      const isReal = bet.customerId?.userType === 0;
      const winAmount = isReal ? bet.amount * matkaData.dealType : 0;

      if (isReal) totalPaidOut += winAmount;

      if (isReal) {
        await Customer.findByIdAndUpdate(bet.customerId._id, {
          $inc: { walletMoney: winAmount },
        });

        await Transaction.create({
          customerId: bet.customerId._id,
          amount: winAmount,
          type: "win",
        });
      }

      betDetails.push({
        betId: bet._id,
        customerId: bet.customerId?._id,
        amountBet: bet.amount,
        amountWon: winAmount,
      });
    }
    const allBets = await Bet.find({
      gameId: matkaId,
      showDown: false,
    });

    for (const bet of allBets) {
      totalBetAmount += bet.amount;
    }

    await Bet.updateMany(
      { gameId: matkaId, showDown: false, numbers: { $in: [winningNumber] } },
      { $set: { isNone: true } }
    );
    await Bet.updateMany({ gameId: matkaId }, { $set: { showDown: true } });

    const profit = totalBetAmount - totalPaidOut;

    const winningEntry = await Winning.create({
      matkaId,
      number: winningNumber,
      bets: betDetails,
      summary: {
        totalBetAmount,
        totalPaidOut,
        profit,
      },
    });

    res.json({ message: "Winning process completed", winningEntry });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error processing winning", error: err.message });
  }
};

exports.getAllWinnings = async (req, res) => {
  try {
    const winnings = await Winning.find()
      .populate("matkaId", "betName") // Only fetch betName from matka
      .sort({ createdAt: -1 }); // latest first

    res.json(winnings);
  } catch (err) {
    console.error("Error fetching winnings:", err.message);
    res.status(500).json({ message: "Failed to fetch winning list." });
  }
};

exports.getLastTenWinnings = async (req, res) => {
  try {
    const results = await Winning.find()
      .select("customerId date number")
      .sort({ declaredAt: -1 })
      .limit(10)
      .populate("matkaId", "betName timeTable"); // select fields from matka

    res.json(results);
  } catch (error) {
    console.error("Error fetching winnings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

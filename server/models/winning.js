const mongoose = require("mongoose");

const WinningSchema = new mongoose.Schema(
  {
    matkaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matka",
      required: true,
    },
    number: { type: Number, required: true },
    date: { type: Date, default: Date.now },

    bets: [
      {
        betId: { type: mongoose.Schema.Types.ObjectId, ref: "Bet" },
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        amountBet: Number,
        amountWon: Number,
      },
    ],

    summary: {
      totalBetAmount: Number,
      totalPaidOut: Number,
      profit: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Winning", WinningSchema);

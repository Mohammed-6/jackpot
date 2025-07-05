const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Matka",
    required: true,
  },
  numbers: [Number],
  amount: Number,
  totalPoints: Number,
  showDown: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isNone: { type: Boolean, default: false },
});

module.exports = mongoose.model("Bet", betSchema);

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit", "bet", "win"],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed", // pending
    },
    betNumber: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);

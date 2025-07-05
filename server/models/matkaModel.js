const mongoose = require("mongoose");

const matkaSchema = new mongoose.Schema(
  {
    betName: {
      type: String,
      required: true,
    },
    dealType: {
      type: Number,
      required: true,
    },
    minAmt: {
      type: Number,
      required: true,
    },
    rangeFrom: {
      type: Number,
      required: true,
    },
    rangeTo: {
      type: Number,
      required: true,
    },
    timeTable: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Matka", matkaSchema);

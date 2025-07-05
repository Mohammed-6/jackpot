const mongoose = require("mongoose");
const crypto = require("crypto");

const generateReferralCode = () =>
  crypto.randomBytes(3).toString("hex").toUpperCase();
const generateCustomerId = () =>
  Math.floor(1000000000 + Math.random() * 9000000000);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    customerId: { type: Number, unique: true },
    referralCode: { type: String, unique: true },
    walletMoney: { type: Number, default: 0 },
    userType: { type: Number, default: 0 },
    referredBy: { type: String, default: null }, // someone else's referralCode
  },
  { timestamps: true }
);

// Generate unique fields before saving
customerSchema.pre("save", async function (next) {
  if (!this.customerId) {
    let exists = true;
    while (exists) {
      const id = generateCustomerId();
      const existing = await mongoose.models.Customer.findOne({
        customerId: id,
      });
      if (!existing) {
        this.customerId = id;
        exists = false;
      }
    }
  }

  if (!this.referralCode) {
    let exists = true;
    while (exists) {
      const code = generateReferralCode();
      const existing = await mongoose.models.Customer.findOne({
        referralCode: code,
      });
      if (!existing) {
        this.referralCode = code;
        exists = false;
      }
    }
  }

  next();
});

module.exports = mongoose.model("Customer", customerSchema);

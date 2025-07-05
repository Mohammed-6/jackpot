// models/Team.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
teamSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const TeamModel = mongoose.model("Team", teamSchema);
module.exports.TeamModel = TeamModel;

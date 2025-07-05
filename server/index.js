const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const matkaRoutes = require("./routes/matkaRoutes");
const customerRoutes = require("./routes/customerRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const betRoutes = require("./routes/betRoutes");
const winningRoutes = require("./routes/winningRoutes");
const roleRoutes = require("./routes/roles.js");
const teamRoutes = require("./routes/team.js");
const authRoutes = require("./routes/auth.js");
const path = require("path");

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://casino.mariosega.com"], // Change this to your frontend URL
    credentials: true, // ✅ Allows cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/matka", matkaRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/winning", winningRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(
  "mongodb+srv://rehankhan:B7uzwg8DlkIUJ9xb@cluster0.yimbm.mongodb.net/matka?retryWrites=true&w=majority"
);

app.listen(4000, function () {
  console.log("Connection established at 4000");
});

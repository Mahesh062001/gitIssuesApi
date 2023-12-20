// src/app.js

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 6000;
const passport = require("passport");
require("./config/passport");
const mongoose = require("mongoose");
const IssueService = require("./service/issueService");
const issueController = require("./controller/issueController");
const errorHandler = require("./middleware/errorHandler");
const issuesRoutes = require("./routes/issuesRoutes");
const dbSECRETKey = process.env.dbSECRETKey;
mongoose.connect(`${dbSECRETKey}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(passport.initialize());
app.use(issuesRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is connected");
});

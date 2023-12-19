require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 6000;

const mongoose = require("mongoose");
const IssueService = require("./service/issueService");
const issueController = require("./controller/issueController");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes/routes");
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

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is connected");
});

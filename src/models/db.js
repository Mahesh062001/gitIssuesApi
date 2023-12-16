const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/GithubIssues", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: "String",
    issue_id: { type: Number, required: true },
    state: { type: String, required: true },
  },
  { collection: "issues" },
  { timestamps: true }
);
const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;

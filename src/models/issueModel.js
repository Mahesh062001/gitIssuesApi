const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: String,
    issue_id: { type: Number, required: true },
    state: { type: String, required: true },
  },
  { collection: "issues" },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;

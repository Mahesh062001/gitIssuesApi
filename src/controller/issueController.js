const issueService = require("../service/issueService");
const { issueIdSchema, gitIssueSchema } = require("../middleware/validation");
const Issue = require("../models/issueModel");

async function sync(req, res, next) {
  try {
    await issueService.syncIssues();
    res.status(200).send("Fetched successfully");
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const { issue_id } = req.params;
    const { error: issueIdError } = issueIdSchema.validate(issue_id);
    if (issueIdError) {
      return res.status(400).send(issueIdError.details[0].message);
    }

    const issue = await issueService.getIssue(issue_id);
    res.status(200).send(issue);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { issue_id } = req.params;
    const updatedGitIssue = req.body;

    const { error: issueIdError } = issueIdSchema.validate(issue_id);
    const { error: gitIssueError } = gitIssueSchema.validate(updatedGitIssue);

    if (issueIdError) {
      return res.status(400).send(issueIdError.details[0].message);
    }

    if (gitIssueError) {
      return res.status(400).send(gitIssueError.details[0].message);
    }

    const updatedIssue = await issueService.updateIssue(
      issue_id,
      updatedGitIssue
    );
    res.status(200).send(updatedIssue);
  } catch (error) {
    next(error);
  }
}

module.exports = { sync, get, update };

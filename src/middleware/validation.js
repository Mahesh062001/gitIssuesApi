const issueService = require("../service/issueService");

const Joi = require("joi");

const Issue = require("../models/issueModel");

const issueIdSchema = Joi.string().alphanum().required();

const gitIssueSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().optional(),
  issue_id: Joi.number().optional(),
  state: Joi.string().optional(),
});

module.exports = { issueIdSchema, gitIssueSchema };

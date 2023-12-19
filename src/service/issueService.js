require("dotenv").config();
const axios = require("axios");
const Issue = require("../models/issueModel");
const githubRepo = process.env.githubRepo;
const githubToken = process.env.githubToken;
class IssueService {
  constructor() {
    this.githubRepo = githubRepo;
    this.githubToken = githubToken;
    this.url = `https://api.github.com/repos/${this.githubRepo}/issues`;
  }

  async fetchGithubIssuesBatch(page, perPage) {
    let response = await axios.get(`${this.url}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
      },
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  }

  async syncIssues() {
    let page = 1;
    const perPage = 3;
    let allIssues;

    do {
      const issuesBatch = await this.fetchGithubIssuesBatch(page, perPage);
      allIssues = issuesBatch.flat();
      console.log(allIssues);
      for (const githubIssue of allIssues) {
        const existingIssue = await Issue.findOne({
          issue_id: githubIssue.number,
        });

        if (existingIssue) {
          await Issue.updateOne(
            { issue_id: githubIssue.number },
            {
              issue_id: githubIssue.number,
              title: githubIssue.title,
              body: githubIssue.body,
              state: githubIssue.state,
            }
          );
        } else {
          await Issue.create({
            issue_id: githubIssue.number,
            title: githubIssue.title,
            body: githubIssue.body,
            state: githubIssue.state,
          });
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      page += 1;
    } while (allIssues.length >= perPage);

    console.log("fetched successfully");
  }

  async getIssue(issue_id) {
    const existingIssue = await Issue.findOne({ issue_id: issue_id });
    if (!existingIssue) {
      throw { name: "NotFound" };
    }
    return existingIssue;
  }

  async updateIssue(issue_id, updatedGitIssue) {
    const existingIssue = await Issue.findOne({ issue_id: issue_id });
    if (!existingIssue) {
      throw { name: "NotFound" };
    }

    const updatedIssue = await Issue.findOneAndUpdate(
      { issue_id: issue_id },
      updatedGitIssue,
      { new: true, upsert: true }
    );

    await axios.patch(`${this.url}/${issue_id}`, updatedGitIssue, {
      headers: { Authorization: `Bearer ${this.githubToken}` },
    });

    return updatedIssue;
  }
}

module.exports = new IssueService();

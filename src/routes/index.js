require("dotenv").config();

const express = require("express");
//

const app = express();
const PORT = 6000;
const axios = require("axios");
const Issue = require("../models/db");
app.use(express.json());

const githubRepo = "Mahesh062001/crudOperation";
const githubToken = process.env.githubToken;

async function fetchGithubIssuesBatch(page, perPage) {
  let response = await axios.get(
    `https://api.github.com/repos/${githubRepo}/issues`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
      params: {
        page,
        per_page: perPage,
      },
    }
  );
  return response.data;
}

app.post("/sync", async (req, res) => {
  try {
    let page = 1;
    const perPage = 3;

    let allIssues;
    do {
      const issuesPromises = fetchGithubIssuesBatch(page, perPage);
      console.log(issuesPromises);
      const issuesBatch = await Promise.all([issuesPromises]);
      console.log(issuesBatch);
      allIssues = issuesBatch.flat();
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

    console.log("Sync completed successfully!");
    res.status(200).send("Sync completed successfully!");
  } catch (error) {
    console.error("Error syncing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/issues/:issue_id", async (req, res) => {
  try {
    const { issue_id } = req.params;
    console.log(issue_id);
    const existingIssue = await Issue.findOne({ issue_id: issue_id });
    if (!existingIssue) {
      return res.status(404).send("Issue not found");
    }
    console.log(existingIssue);
    res.status(200).send(existingIssue);
  } catch (error) {
    if (error.name === "AuthenticationError") {
      res.status(401).json({ error: "Authentication required" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.put("/issues/:issue_id", async (req, res) => {
  try {
    const { issue_id } = req.params;
    const updatedGitIssue = req.body;
    const existingIssue = await Issue.findOne({ issue_id: issue_id });
    if (!existingIssue) {
      return res.status(404).send("Issue not found");
    }
    console.log(updatedGitIssue);
    const updatedIssue = await Issue.findOneAndUpdate(
      { issue_id: issue_id },
      updatedGitIssue,
      { new: true, upsert: true }
    );
    console.log(updatedIssue);
    await axios.patch(
      `https://api.github.com/repos/${githubRepo}/issues/${issue_id}`,
      updatedGitIssue,
      {
        headers: { Authorization: `Bearer ${githubToken}` },
      }
    );

    res.status(200).send(updatedIssue);
  } catch (error) {
    if (error.name === "AuthenticationError") {
      res.status(401).json({ error: "Authentication required" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(PORT, () => {
  console.log("server is connected");
});

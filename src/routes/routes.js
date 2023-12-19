const express = require("express");
const issueController = require("../controller/issueController");

const router = express.Router();

router.post("/sync", issueController.sync);
router.get("/issues/:issue_id", issueController.get);
router.put("/issues/:issue_id", issueController.update);

module.exports = router;

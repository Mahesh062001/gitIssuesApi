const express = require("express");
const issueController = require("../controller/issueController");
const passport = require("passport");

const authRoutes = require("./authRoutes");
const router = express.Router();
router.use("/auth", authRoutes);
router.use(passport.authenticate("jwt", { session: false }));
router.post("/sync", issueController.sync);
router.get("/issues/:issue_id", issueController.get);
router.put("/issues/:issue_id", issueController.update);

module.exports = router;

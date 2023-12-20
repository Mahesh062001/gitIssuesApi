require("dotenv").config();

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    console.log("register");
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  })(req, res, next);
});

module.exports = router;

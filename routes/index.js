const express = require("express");
const router = express.Router();

// Get Login/Landing page
router.get("/", (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// Get Dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = router;

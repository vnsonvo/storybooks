const express = require("express");
const passport = require("passport");
const router = express.Router();

// Auth with google
// Get /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// Google auth callback
// Get /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc Logout user
// @route /auth/logout
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;

const express = require("express");
const passport = require("passport");

const router = express.Router();

// the gateway to protected pages
router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = router;

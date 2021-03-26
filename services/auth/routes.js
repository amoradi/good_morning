const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/login', passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

module.exports = router;

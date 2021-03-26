const express = require('express');
const passport = require('passport');
const fakeDb = require('../../db');

const router = express.Router();

router.post('/users/create', (req, res) => {
  const username = res.body.username;
  const password = res.body.password;
  const foundUser = fakeDb.find((rec) => rec.username === username);

  if (foundUser) {
    req.flash("error", "User already exists");
    return res.redirect("/signup");
  }

  // success
  fakeDb.push(
    {
      email: '',
      id: '',
      password, // TODO: salt
      username,
    }
  );
},
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));

// TODO: POST users/update

module.exports = router;

const express = require("express");
const passport = require("passport");
const isAuthorized = require("../auth/isAuthorized");
const fakeDb = require("../../db");

const router = express.Router();

router.get("/users/:username", isAuthorized, (req, res) => {
  const foundUser = fakeDb.find((rec) => rec.username === req.params.username);

  // return user object
});

router.put("/users/:username/", isAuthorized, (req, res) => {});

router.post(
  "/users/create",
  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = fakeDb.find((rec) => rec.username === username);

    if (foundUser) {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    }

    // success
    fakeDb.push({
      email: "",
      id: "",
      password, // TODO: salt
      username,
    });
  },
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

module.exports = router;

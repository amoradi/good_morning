const express = require("express");
const passport = require("passport");
const isAuthorized = require("../auth/isAuthorized");
const fakeDb = require("../../db");

const router = express.Router();

// you can only GET youself
router.get("/users/:username", isAuthorized, (req, res) => {
  const foundUser = fakeDb.find((rec) => rec.username === req.params.username);

  if (foundUser) {
    res.status(200).json({ username: foundUser.username });
  } else {
    res.status(404)
  }
});

router.delete("/users/:username", isAuthorized, (req, res) => {
  const foundIndex = fakeDb.indexOf((rec) => rec.username === req.params.username);
  if (foundIndex > -1) {
    fakeDb.splice(foundIndex, 1);
  }

  if (foundIndex) {
    // return deleted username
    res.status(200).json({ username: fakeDb[foundIndex].username });
  } else {
    res.status(404)
  }
});

router.patch("/users/:username", isAuthorized, (req, res) => {
  const foundUser = fakeDb.find((rec) => rec.username === req.params.username);

  if (foundUser) {
    if (req.body.password) {
      foundUser.password = req.body.password;
    }

    if (req.body.email) {
      foundUser.email = req.body.email;
    }

    res.status(200).json({ username: foundUser.username });
  } else {
    res.status(404)
  }

});

router.post(
  "/users/create",
  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = fakeDb.find((rec) => rec.username === username);

    if (username === '' || username === undefined) {
      req.flash("error", "Username must be at least 1 character");
      return res.redirect("/signup");
    }

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

    res.status(201).json({ username })
  },

  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

module.exports = router;

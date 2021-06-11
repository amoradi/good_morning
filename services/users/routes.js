const express = require("express");
const passport = require("passport");
const isAuthorized = require("../auth/isAuthorized");
const fakeDb = require("../../db");
const db = require("../../db");

// app.get('/:id', (req, res, next) => {
//   db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, res) => {
//     if (err) {
//       return next(err)
//     }
//     res.send(res.rows[0])
//   })
// })

const router = express.Router();

// User = {
//   username: string;
//   email: string;
//   password: string;
// }

// you can only GET youself
router.get("/users/:username", isAuthorized, (req, res) => {
  const query = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [req.params.username],
  };
  
  db.query(query, (err, res) => {
    if (err) {
      return next(err)
    }

    const foundUser = res.rows[0];

    if (foundUser) {
      res.status(200).json({ username: foundUser.username });
    } else {
      res.status(404);
    }
  })

});

router.delete("/users/:username", isAuthorized, (req, res) => {
  const foundIndex = fakeDb.indexOf(
    (rec) => rec.username === req.params.username
  );
  if (foundIndex > -1) {
    fakeDb.splice(foundIndex, 1);
  }

  if (foundIndex) {
    // return deleted username
    res.status(204).json({ username: fakeDb[foundIndex].username });
  } else {
    res.status(404);
  }
});

// update a piece of User
router.put("/users/:username", isAuthorized, (req, res) => {
  const foundUser = fakeDb.find((rec) => rec.username === req.params.username);

  if (foundUser) {
    if (req.body.password) {
      // TODO: validate. should happen when integrating DB
      foundUser.password = req.body.password;
    }

    if (req.body.email) {
       // TODO: validate. should happen when integrating DB
      foundUser.email = req.body.email;
    }

    res.status(200).json({ username: foundUser.username });
  } else {
    res.status(404);
  }
});

// create a user
router.post(
  "/users/create",
  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = fakeDb.find((rec) => rec.username === username);

    if (username === "" || username === undefined) {
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

    res.status(201).json({ username });
  },

  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

module.exports = router;

const bcrypt = require('bcrypt');
const express = require("express");
const passport = require("passport");
const isAuthorized = require("../auth/isAuthorized");
const fakeDb = require("../../db");
const db = require("../../db");
// TODO: npm install express-validator
const router = express.Router();

// you can only GET yourself
router.get("/users/:username", isAuthorized, (req, res) => {  
  db.query(db.getUser(req.params.username), (err, dbRes) => {
    if (err) {
      req.flash("error", err); 
      res.status(404);
    } else {
      const foundUser = dbRes.rows[0];

      if (foundUser) {
        res.status(200).json({ username: foundUser.username });
      } else {
        res.status(404);
      }
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
// NOTE: this route is impure, in that it is coupled to the sign-up-login page flow
router.post(
  "/users/create",
  (req, res) => {
    const { email, username, password } = req.body;
    
    if (username === "" || username === undefined) {
      req.flash("error", "Username must be at least 1 character");
      // side effect
      return res.redirect("/sign-up");
    }

    if (password === "" || password === undefined) {
      req.flash("error", "Password must be at least 1 character");
      // side effect
      return res.redirect("/sign-up");
    }

    db.query(db.getUser(username), (err, dbRes) => {
      if (err) {
        req.flash("error", err.toString());
        // side effect
        return res.redirect("/sign-up");
      }

      const foundUser = dbRes.rows[0];

      if (foundUser) {
        req.flash("error", "User already exists");
        return res.redirect("/sign-up");
      }

      const now = new Date().toISOString();
      const saltRounds = 10;

      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          const insertUser = {
            text: 'INSERT INTO users (email, password, username, created_on, last_updated) VALUES ($1, $2, $3, $4, $5)',
            values: [email, hash, username, now, now]
          };

          db.query(insertUser, (err) => {
            if (err) {
              req.flash("error", err.toString());
              // side effect
              return res.redirect("/sign-up");
            } else {
              // side effect
              req.flash("info", `Success, created user: ${username}`);
              res.redirect('/login');
            }
          });
        });
      });
    });
  },
);

module.exports = router;

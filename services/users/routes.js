const bcrypt = require('bcrypt');
const express = require("express");
const passport = require("passport");
const isAuthorized = require("../auth/isAuthorized");
const fakeDb = require("../../db");
const db = require("../../db");
// TODO: npm install express-validator
const router = express.Router();
const saltRounds = 10;
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

// create a user
// NOTE: this route is impure, in that it is coupled to the sign-up-login page flow
router.post(
  "/users/create",
  (req, res) => {
    const { email, username, password } = req.body;
    
    console.log('this mofo....', username, password);
    
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
              return res.redirect('/login');
            }
          });
        });
      });
    });
  }
);

// update a user
// NOTE: this route is impure, in that it is coupled to the edit page flow
router.post("/users/:username", isAuthorized, (req, res) => {
  db.query(db.getUser(req.params.username), (err, dbRes) => {
    if (err) {
      req.flash("error", err); 
      return res.redirect("/edit");
    } else {
      const foundUser = dbRes.rows[0];
      const { email, password, password_confirm } = req.body;

      if (!password) {
        req.flash("error", "passwords must be 8 chars long");
      }

      if (!email) {
        req.flash("error", "invalid email");
      }

      if (!password || !email) {
        return res.redirect("/edit");
      }

      if (password !== password_confirm) {
        req.flash("error", "passwords don't match");
        return res.redirect("/edit");
      }

      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === false) {
            bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(password, salt, function(err, hash) {
                const updateUser = {
                  text: 'UPDATE users SET password = $1',
                  values: [hash]
                };

                if (foundUser.email !== email) {
                  updateUser.text += ', email = $2';
                  updateUser.values.push(email);
                }

                db.query(updateUser, (err) => {
                  if (err) {
                    req.flash("error", err.toString());
                    return res.redirect("/edit");
                  } else {
                    req.flash("info", `Success, updated ${foundUser.username}.`);
                    return res.redirect("/edit");
                  }
                });
              })
            });
          } else {
            if (foundUser.email !== email) {
              const updateUser = {
                text: 'UPDATE users SET email = $1',
                values: [email]
              };

              db.query(updateUser, (err) => {
                if (err) {
                  req.flash("error", err.toString());
                  return res.redirect("/edit");
                } else {
                  req.flash("info", `Success, updated ${foundUser.username}'s email address.`);
                  return res.redirect("/edit");
                }
              });
            } else {
              req.flash("info", 'Nothing to update.');
              return res.redirect("/edit");
            }
          }
        });

      } else {
        req.flash("error", "user not found");
        return res.redirect("/edit");
      }
    }
  });
});

module.exports = router;

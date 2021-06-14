const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../../db');

// GOOD WATCHING READING: https://www.youtube.com/watch?v=U6OcC0yq1CE
// Server sessions vs JWT

// Used to serialize and deserialize Users to and from the session
//
// Explained:
// if authentication succeeds, a session will be established and maintained
// via a browser cookie. Each subsequent request (after login) will not contain User credentials
// but rather a unique cookie tied to the User's session.
// In order to support these login sessions, Passport needs to serialize and deserialize
// Users to and from the session.
module.exports = () => {
  passport.serializeUser(function(user, done) {
    done(null, user.username)
  })

  passport.deserializeUser(function(username, done) {
    db.query(db.getUser(username), (err, res) => {
      if (err) {
        done(err, false);
      }

      const foundUser = res.rows[0];

      if (foundUser) {
        done(null, foundUser);
      } else {
        done(null, false, { message: "User not found for ID: " + id });
      }
    });
  })

  // login with local strategy
  passport.use("login", new LocalStrategy(
    function(username, password, done) {
      db.query(db.getUser(username), (err, res) => {
        if (err) {
          done(err, false);
        }
  
        const foundUser = res.rows[0];

        if (foundUser) {
          bcrypt.compare(password, foundUser.password /* hashed */, function(err, result) {
            if (err) {
              return done(err, false);
            } else if (result) {
              return done(null, { email: foundUser.email, username: foundUser.username });
            } else {
              return done(null, false, { message: "Invalid password" });
            }
          });
        } else {
          return done(null, false, { message: "Username not found" });
        }
      });
    }
  ))
}


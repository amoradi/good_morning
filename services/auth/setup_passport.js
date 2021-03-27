const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const fakeDb = require("../../db");

// GOOD WATCHING READING: https://www.youtube.com/watch?v=U6OcC0yq1CE
// Server sessions vs JWT

// Used to serialize and deserialize Users to and from the session
//
// Explained:
// if authentication succeeds, a session will be established and maintained
// via a browser cookie. Each subsequent request (post login) will not contain User credentials
// but rather a unique cookie tied to the User's session.
// In order to support these login sessions, Passport needs to serialize and deserialize
// Users to and from the session.
module.exports = () => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    const foundUser = fakeDb.find((user) => {
      return user.id === id;
    });

    if (foundUser) {
      done(null, foundUser);
    } else {
      done(null, false, { message: "User not found for ID: " + id });
    }
  });

  // login with local strategy
  passport.use(
    "login",
    new LocalStrategy(function (username, password, done) {
      const foundUser = fakeDb.find((rec) => rec.username === username);

      if (foundUser) {
        // TODO: don't perist plaintext passwords
        if (password === foundUser.password) {
          return done(null, foundUser);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      } else {
        return done(null, false, { message: "Username not found" });
      }
    })
  );
};

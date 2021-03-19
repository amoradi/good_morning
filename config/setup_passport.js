const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const fakeDb = [
  {
    email: 'moradi.aaron@gmail.com',
    id: 'testId',
    password: 'texas',
    username: 'aaronm',
  }
];

// Used to serialize and deserialize Users to and from the session
//
// Explained:
// if authentication succeeds, a session will be established and maintained
// via a browser cookie. Each subsequent request (post login) will not contain User credentials
// but rather a unique cookie tied to the User's session.
// In order to support these login sessions, Passport needs to serialize and deserialize
// Users to and from the session.
module.exports = () => {
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    const foundUser = fakeDb.find((user) => {
      return user.id === id;
    });

    if (foundUser) {
      done(null, user);
    } else {
      done(null, false, { message: "User not found for ID: " + id });
    }
  })

  // authentication steps (using a local strategy)
  //
  // - look for user with supplied username
  // - if no user exists, then your user isn't authenticated, return "username does not exist"
  // - if user does exist, compare passwords
  // - if the passwords match, return the User, otherwise, return "invalid password"
  passport.use("login", new LocalStrategy(
    function(username, password, done) {
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
    }
  ))
}


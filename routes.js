const express = require('express');
const passport = require('passport');
const fakeDb = require('./db');

// # routes
// 
// # services (separate routers)(REST APIs)
// users
// holdings
//
// # app 
//
// / (dashboard)
// /edit
// /profile
//
// authentication
// /login
// /reset-password
// /create-account
// 

// TODO:
// - flash isn't working. does that mean i need some HTML elements for it
// to hook into????
// - route tests?
// - routers for each API???: User API. Holdings API?

const router = express.Router();

//// HELPERS
// attach submit callback to form id='form'
const onFormSubmit = (onSubmit) => {
  return `<script>
    const form = document.getElementById("form");

    form.addEventListener("submit", function(event) {
      event.preventDefault();

      (${onSubmit})();
    });
  </script>`;
}

//// GENERAL PASSPORT MIDDLEWARE
router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

// login
// - login into app with username and pw
// - username input/email input, pw input, forgot pw? link, create account link
// - users service
router.get('/login', (req, res) => {
  if (req.isAuthenticated() /* a passport fn */) {
    res.redirect('/');
  } else {
    // else serve login form
    res.send(`
      <form id="form" action="/login" method="post">
        <input type="text" placeholder="username" name="username"></input>
        <input type="password" placeholder="password" name="password"></input>
        <input type="submit" value="Submit">
      </form>
    `);
  }

  // ${onFormSubmit(`() => {
  //   console.log('POST to auth service...')
  // }`)}
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.post('/login', passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

// create account
// - /create-account
// - create new account
// - username, email, pw inputs
router.get('/create-account', (req, res) => {
  res.send(`
  <form id="form" action="/users/create" method="post">
    <input type="text" placeholder="username"></input>
    <input type="text" placeholder="email"></input>
    <input type="password" placeholder="password"></input>
    <input type="submit" value="Submit">
  </form>

  ${onFormSubmit(`() => {
    console.log('POST to user service: create ...')
  }`)}
`);
});


router.post('/user/create', (req, res, next) => {
  // username is unique
  // and the email is uniuqe
  // save the user to the DB
  // then redirect to /login
  const username = res.body.username;
  const password = res.body.password;

  const foundUser = fakeDb.find((rec) => rec.username === username);

  if (foundUser) {
    req.flash("error", "User already exists");
    return res.redirect("/create-account");
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

  passport.authenticate("login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/create-account",
    failureFlash: true
  }));



  // else redirect back to /create-accout with
  // flash messages: username already exists. email alreading exists
});



//// ROUTES BEHIND AUTHENTICATION BOUNDARY 

// authentication middleware. protect routes with this.
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated() /* a passport fn */) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect('./login');
  }
}

// routes: /, edit, reset-password, profile
 
// reset pw <logged-in>
// - /reset-password
// - update password...bc you forgot it
// - insert new pw input, confirmation input... do it again.
// - users service
router.get('/reset-password', isAuthenticated, (req, res) => {
  res.send(`
  <form id="form">
    <input type="text" placeholder="6 digit passcode"></input>
    <input type="text" placeholder="new password"></input>
    <input type="password" placeholder="confirm password"></input>
    <input type="submit" value="Submit">
  </form>

  ${onFormSubmit(`() => {
    console.log('POST to user service: reset pw ...')
  }`)}
`);
});

// profile <logged-in>
// - /profile
// - see profile data: username, email, pw and link to edit them
// - username, emial, pw inputs, edit email link, edit pw link
// - users service
router.get('/profile', isAuthenticated, (req, res) => {
  res.send(`
  <form id="form">
    <input type="text" placeholder="username"></input>
    <input type="text" placeholder="email"></input>
    <input type="password" placeholder="password"></input>
    <input type="submit" value="Submit">
  </form>

  ${onFormSubmit(`() => {
    console.log('POST to user service: update username, email, pw ...')
  }`)}
`);
});

// dashboard <logged-in>
// - /
// - display all data
// - current holdings, holdings over time and aggregate. Hard-coded: news, weather goals
// - edit assets link, log out link, profile link
// - holdings service
router.get('/', isAuthenticated, (req, res) => {
  res.send(`
  <div>my holdings...</div>
`);
});

// edit <logged-in>
// - /edit
// - add/remove/edit assets
// - add holding form, remove holding link + button confirm, edit assets amt input + button save
// - holdings service
router.get('/edit', isAuthenticated, (req, res) => {
  res.send(`
  <form id="form">
    <div>remove holding link + button confirm, edit assets amt input + button save</div>
  </form>

  ${onFormSubmit(`() => {
    console.log('POST to holdings service: CRUD ...')
  }`)}
`);
});

module.exports = router;

const express = require("express");

const isAuthenticated = require("./services/auth/isAuthenticated");

const router = express.Router();
const flashMessage = (message) =>
  `<p style="color:#ff0000;font-size:12px">${message}</p>`;

// === PAGES === //

router.get("/login", (req, res) => {
  if (req.isAuthenticated() /* a passport fn */) {
    res.redirect("/");
  } else {
    // else serve login form
    res.send(`
      ${flashMessage(res.locals.errors)}
      <h1>login</h1>
      <form id="form" action="/api/login" method="post">
        <input type="text" placeholder="username" name="username"></input>
        <input type="password" placeholder="password" name="password"></input>
        <input type="submit" value="Submit">
      </form>
      <br />
      <a href="/sign-up">sign up</a>
    `);
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/sign-up", (req, res) => {
  res.send(`
  ${flashMessage(res.locals.errors)}
  <h1>sign up</h1>
  <form id="form" action="/api/users/create" method="post">
    <input type="text" placeholder="username" name="username"></input>
    <input type="text" placeholder="email" name="email"></input>
    <input type="password" placeholder="password" name="password"></input>
    <input type="submit" value="create account">
  </form>
  <br />
  <a href="/login">login</a>
`);
});


// === PROTECTED PAGES === //

// - current holdings, holdings over time and aggregate. Hard-coded: news, weather goals
// - edit assets link, log out link, profile link
// - hits holdings service
//
// (alias route for my-holdings)
router.get("/", isAuthenticated, (req, res) => {
  res.redirect("/my-holdings");
});
router.get("/my-holdings", isAuthenticated, (req, res) => {
  // /api/holdings/:username/get
  // etc.

  res.send(`
    <h1>my holdings</h1>
  `);
});

// edit profile and holdings...
// add, remove holdings and change amounts
router.get("/edit", isAuthenticated, (req, res) => {
  // get user info, GET /api/users/:username
  // get user holdings, GET /api/holdings/:username
  // -> populate the form and HTML with this stuff ^ 

  // on submit, PUT /api/users/:username (update user)
  // ensure ajax reqest has necessary passport data (to confirm isAuthenticated)
  //
  res.send(`
  ${flashMessage(res.locals.errors)}
  <h1>edit</h1>
  <h2>my profile</h2>
  <form id="form">
    <input type="text" placeholder="username"></input>
    <input type="text" placeholder="email"></input>
    <input type="password" placeholder="password"></input>
    <input type="submit" value="Submit">
  </form>

  <h2>my holdings</h2>
  <form id="form">
    <div>remove holding link + button confirm, edit assets amt input + button save</div>
  </form>
`);
});

module.exports = router;

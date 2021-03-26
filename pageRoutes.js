const express = require('express');

const isAuthenticated = require('./services/auth/isAuthenticated');
const router = express.Router();

const flashMessage = (message) => `<p style="color:#ff0000;font-size:12px">${message}</p>`;

// === PAGES === //
// TODO: add create account link
router.get('/login', (req, res) => {
  if (req.isAuthenticated() /* a passport fn */) {
    res.redirect('/');
  } else {
    // else serve login form
    res.send(`
      ${flashMessage(res.locals.errors)}
      <form id="form" action="/login" method="post">
        <input type="text" placeholder="username" name="username"></input>
        <input type="password" placeholder="password" name="password"></input>
        <input type="submit" value="Submit">
      </form>
    `);
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get('/signup', (req, res) => {
  res.send(`
  ${flashMessage(res.locals.errors)}
  <form id="form" action="/users/create" method="post">
    <input type="text" placeholder="username"></input>
    <input type="text" placeholder="email"></input>
    <input type="password" placeholder="password"></input>
    <input type="submit" value="Submit">
  </form>
`);
});

// - current holdings, holdings over time and aggregate. Hard-coded: news, weather goals
// - edit assets link, log out link, profile link
// - hits holdings service
router.get('/', isAuthenticated, (req, res) => {
  res.send(`
  <div>my holdings...</div>
`);
});

// edit profile and holdings...
// add, remove holdings and change amounts
router.get('/edit', isAuthenticated, (req, res) => {
  res.send(`
  ${flashMessage(res.locals.errors)}
  <!-- EDIT PROFILE -->
  <form id="form">
    <input type="text" placeholder="username"></input>
    <input type="text" placeholder="email"></input>
    <input type="password" placeholder="password"></input>
    <input type="submit" value="Submit">
  </form>

  <!-- EDIT HOLDINGS -->
  <form id="form">
    <div>remove holding link + button confirm, edit assets amt input + button save</div>
  </form>
`);
});

module.exports = router;

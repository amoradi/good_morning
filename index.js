// imports


// # middleware
//
// security
// - XSS, CSRF 
// authentication
// authorization

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

const express = require('express');
const app = express();

const { port = 3000 } = process.env;

// assumes 'id=form'
const scriptTag = (onSubmit) => {
  return `<script>
    const form = document.getElementById("form");

    form.addEventListener("submit", function(event) {
      event.preventDefault();

      (${onSubmit})();
    });
  </script>`;
}

// login
// - login into app with username and pw
// - username input/email input, pw input, forgot pw? link, create account link
// - users service
app.get('/login', (req, res) => {
  // if already authenticated, redirect to /
  // else serve login form
  res.send(`
    <form id="form">
      <input type="text" placeholder="username or email"></input>
      <input type="password" placeholder="password"></input>
      <input type="submit" value="Submit">
    </form>

    ${scriptTag(`() => {
      console.log('POST to auth service...')
    }`)}
  `);
});

// create account
// - /create-account
// - create new account
// - username, email, pw inputs
app.get('/create-account', (req, res) => {
  res.send(`
  <form id="form">
    <input type="text" placeholder="username"></input>
    <input type="text" placeholder="email"></input>
    <input type="password" placeholder="password"></input>
    <input type="submit" value="Submit">
  </form>

  ${scriptTag(`() => {
    console.log('POST to user service: create ...')
  }`)}
`);
});

// reset pw <logged-in>
// - /reset-password
// - update password...bc you forgot it
// - insert new pw input, confirmation input... do it again.
// - users service
app.get('/reset-password', (req, res) => {
  res.send(`
  <form id="form">
    <input type="text" placeholder="6 digit passcode"></input>
    <input type="text" placeholder="new password"></input>
    <input type="password" placeholder="confirm password"></input>
    <input type="submit" value="Submit">
  </form>

  ${scriptTag(`() => {
    console.log('POST to user service: reset pw ...')
  }`)}
`);
});

// profile <logged-in>
// - /profile
// - see profile data: username, email, pw and link to edit them
// - username, emial, pw inputs, edit email link, edit pw link
// - users service
app.get('/profile', (req, res) => {
  res.send(`
  <form id="form">
    <input type="text" placeholder="username"></input>
    <input type="text" placeholder="email"></input>
    <input type="password" placeholder="password"></input>
    <input type="submit" value="Submit">
  </form>

  ${scriptTag(`() => {
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
app.get('/', (req, res) => {
  res.send(`
  <div>my holdings...</div>
`);
});

// edit <logged-in>
// - /edit
// - add/remove/edit assets
// - add holding form, remove holding link + button confirm, edit assets amt input + button save
// - holdings service
app.get('/edit', (req, res) => {
  res.send(`
  <form id="form">
    <div>remove holding link + button confirm, edit assets amt input + button save</div>
  </form>

  ${scriptTag(`() => {
    console.log('POST to holdings service: CRUD ...')
  }`)}
`);
});


// start the server ....
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
});

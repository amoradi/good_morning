const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const routes = require("./routes");
const setupPassport = require('./config/setup_passport');

// # middleware
//
// security
// - XSS, CSRF 
// authentication
// authorization

//// SETUP
const { port = 3000 } = process.env;
const app = express();
setupPassport();

//// AUTHENTICATION MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: ">>>!makeITpayDUDE##!<<<", // each client session is encrypted
  resave: true, // session will update even when it hasn't been modified
  saveUninitialized: true // resets uninitialized sessions
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//// ROUTES
app.use(routes);

//// START SERVER
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
});

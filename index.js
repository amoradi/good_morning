
require('dotenv').config();

const bodyParser = require("body-parser");
const express = require("express");
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const pagesRoutes = require("./routes");
const setupPassport = require("./services/auth/setup_passport");
const authRoutes = require("./services/auth/routes");
const usersRoutes = require("./services/users/routes");

// # middleware
//
// security
// - XSS, CSRF
// authentication
// authorization

// === SETUP === //
const { port = 3000 } = process.env;
const app = express();

// setup passport
// - define serialize/deserialize user methods
// - make authentication strategy available
setupPassport();

// === MIDDLEWARE === //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    httpOnly: true,
    sameSite: true,
    // TODO: secure: true, // need https first
    secret: ">>>!makeITpayDUDE##!<<<", // each client session is encrypted
    resave: true, // session will update even when it hasn't been modified
    saveUninitialized: true, // resets uninitialized sessions
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// set locals
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

// === ROUTES === //
app.use('/api', authRoutes);
app.use(pagesRoutes);
app.use('/api', usersRoutes);
// app.use('/api', holdingsRoutes);

// === START SERVER === //
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports = { app, server };

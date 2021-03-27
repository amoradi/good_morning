// authorization middleware. protect content (API routes) with this.
// user session username must match :username
function isAuthorized(req, res, next) {
  // reading "req.user.username" from passport.session() (in index.js)
  const isSaidUser = req.user.username === req.params.username;

  if (req.isAuthenticated() && isSaidUser) {
    next();
  } else {
    // return err status code
    // and message
  }
}

module.exports = isAuthorized;

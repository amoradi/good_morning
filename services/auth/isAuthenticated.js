// authentication middleware. protect routes with this.
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated() /* a passport fn */) {
    next();
  } else {
    req.flash("errors", "You must be logged in to see this page.");
    res.redirect('./login');
  }
}

module.exports = isAuthenticated;

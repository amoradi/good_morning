// users can only interact with their own user data and nothing else
//
// authorization middleware. protect content (API routes) with this.
// user session username must match :username
function isAuthorized(req, res, next) {
  // reading "req.user.username" from passport.session() (in index.js)
  //
  // I assume this is safe, comparing: 
  // <something passport-owned (tamper-proof)> to <req.params (tamper-able)>
  const isSaidUser = !!(req.user && req.user.username === req.params.username);

  if (req.isAuthenticated() && isSaidUser) {
    next();
  } else {
    req.flash("error", "Unauthorized");
    return res.redirect("/");
  }
}

module.exports = isAuthorized;

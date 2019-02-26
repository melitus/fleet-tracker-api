const passport = require('passport');

module.exports = {
  requireJWT: passport.authenticate('jwt', { session: false }),
  }


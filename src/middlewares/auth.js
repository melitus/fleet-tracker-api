const passport = require('passport');

module.exports = {
    requireAuth: passport.authenticate('jwt', { session: false }),
  }


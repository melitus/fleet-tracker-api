const strategies = require('../config/passport')
const { providePassport } = require('../policies/authstrategy/authmanager')

exports.passportLoader = app => {
  // Adding each OAuth provider's strategy to passport
  app.use(providePassport().initialize())
  providePassport().use('local', strategies.localLogin)
  providePassport().use('jwt', strategies.jwt)
  providePassport().use('facebook', strategies.facebook)
  providePassport().use('google', strategies.google)
}

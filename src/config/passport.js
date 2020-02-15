const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const BearerStrategy = require('passport-http-bearer')
const LocalStrategy = require('passport-local')

const config = require('./credentials')
const User = require('../api/user/user.model')
const authProviders = require('../services/authProvider/authProviders')

// Setup options for JWT strategy
const jwtOptions = {
  secretOrKey: config.appKey.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer') // We use this to extract the JWT sent by the user
}
const localOptions = { usernameField: 'email', passwordField: 'password' }

const localLogin = async (email, password, done) => {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return done(null, false, { message: 'No user by that email' })
    }
    const match = await user.passwordMatches(password)
    if (!match) {
      return done(null, false, { message: 'Not a matching password' })
    }
    if (user.role < 1) {
      return done(null, false)
    }

    return done(null, user, { message: 'Logged in Successfully' })
  } catch (e) {
    return done(e.message, false)
  }
}

// Create jwt strategy

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)
    if (user)
      // Pass the user details to the next middleware
      return done(null, user)
  } catch (error) {
    console.log({ error: 'from passport' }, error)
    return done(error.message, false)
  }
}

const oAuth = service => async (token, done) => {
  try {
    const userData = await authProviders[service](token)
    const user = await User.oAuthLogin(userData)
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}

// Use Local Login for username/password Login, then ...
exports.localLogin = new LocalStrategy(localOptions, localLogin)
// Once we are logged in and received a JWT the user will send it each request
// passport will validate that token
exports.jwt = new JwtStrategy(jwtOptions, jwt)
exports.facebook = new BearerStrategy(oAuth('facebook'))
exports.google = new BearerStrategy(oAuth('google'))

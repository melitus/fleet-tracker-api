const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { appKey } = require("../config/credentials");
const User = require('../models/user.model');

// Setup options for JWT strategy
const jwtOptions = {
  secretOrKey: appKey.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'), // We use this to extract the JWT sent by the user
};

// Create jwt strategy

const jwt = async (payload, done) => {
  try {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a user object
    const user = await User.findById(payload.sub);
    if (user) 
    //Pass the user details to the next middleware
    return done(null, user);
  } catch (error) {
    return done(error.message, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);

 
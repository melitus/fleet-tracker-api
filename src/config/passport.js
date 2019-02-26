const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { appKey } = require("../config/credentials");
const Fleet = require('../models/fleet.model');

// Setup options for JWT strategy
const jwtOptions = {
  secretOrKey: appKey.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'), // We use this to extract the JWT sent by the fleet
};

// Create jwt strategy

const jwt = async (payload, done) => {
  try {
    // See if the fleet ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a fleet object
    const fleet = await Fleet.findById(payload.sub);
    if (fleet) 
    //Pass the fleet details to the next middleware
    return done(null, fleet);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);

 
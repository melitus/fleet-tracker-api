const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const { appKey } = require("../config/credentials");
const User = require('../models/fleet.model');

// Setup options for JWT strategy
const jwtOptions = {
  secretOrKey: appKey.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'), // We use this to extract the JWT sent by the user
};

// Create options local strategy
const localOptions = {
  usernameField: 'email'
};

// create local strategy
const localLogin = async (email, password, done) => {
  // Verify this email and password, call done with the user
  // if it is correct email and password
  // otherwise call done with false
  try{
    const user =  await User.findOne({ email: email.toLowerCase()});
   
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
  }
  user.passwordMatches(password, function (err, isMatch) {
    if (err) {
      return done(err);
    }
    if (!isMatch) {
      return done(null, false, { msg: 'Invalid email or password.' });
    }
    //Send the user information to the next middleware
    return done(null, user, { message : 'Logged in Successfully'});

  })
  
   }  catch (error) {
    return done(error, false);
  }
   
};

// Create jwt strategy

const jwtLogin = async (payload, done) => {
  try {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a user object
    const user = await User.findById(payload.sub);
    if (user) 
    //Pass the user details to the next middleware
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwtLogin = new JwtStrategy(jwtOptions, jwtLogin);
exports.localLogin = new LocalStrategy(localOptions, localLogin);

 
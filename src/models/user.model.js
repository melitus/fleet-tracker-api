const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uniqueValidator = require("mongoose-unique-validator");
const uuidv4 = require('uuid/v4');

const APIError = require('../utils/APIError');
const { appKey } = require("../config/credentials");

// User Roles
const roles = ["guest", "admin"];

// User Schema
 
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    unique: true, 
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  role: {
    type: String,
    enum: roles,
    default: "guest"
  },
  uuid: {
    type: String,
    default: uuidv4(),
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = appKey.env === 'test' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({

  token() {
    const playload = {
      exp: moment().add(appKey.jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, appKey.jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
userSchema.statics = {

  async findAndGenerateToken(options) {
    const { email, password } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user,  accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
  } 
    else {
      err.message = 'Incorrect email';
    }
    throw new APIError(err);
  },

  // Return new validation error, if error is a mongoose duplicate key error
   
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
  async verifyEmail(uuid) {
    if (!uuid) throw new APIError({ message: 'No token found for verification' });
    try {
      const user = await this.findOneAndUpdate({ uuid }, { emailVerified: true }).exec();
      
      if(user) {
        return { message: 'Thank you for verification' }
      }
      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch(err) {
      throw new APIError(err);
    }
  },

  async FindOneAndUpdate(query, update) {
    try {
      const user = await this.findOneAndUpdate(query, update).exec();
      if(user) {
        return user
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch(err) {
      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.BAD_REQUEST,
      });
    }
  },
};
const self = this;

userSchema.plugin(uniqueValidator, { message: `${self.email} already exist` });

module.exports = mongoose.model('user', userSchema);

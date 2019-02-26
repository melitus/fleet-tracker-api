const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

const APIError = require('../utils/APIError');
const { appKey } = require("../config/credentials");

// Fleet Categories
const categories = ["car", "truck"];

// Fleet Schema
 
const fleetSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  category: {
    type: String,
    enum: categories,
    default: "car"
  },
  trackingnumber: {
    type: String,
    default: uuidv4(),
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
fleetSchema.pre('save', async function save(next) {
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
fleetSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'category', 'trackingnumber'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
fleetSchema.statics = {

  // Get Fleet
   
  async get(id) {
    try {
      let Fleet;

      if (mongoose.Types.ObjectId.isValid(id)) {
        Fleet = await this.findById(id).exec();
      }
      if (Fleet) {
        return Fleet;
      }

      throw new APIError({
        message: 'Fleet does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  // List Fleets in descending order of 'createdAt' timestamp.
   
  list({
    page = 1, perPage = 30, name, email, category,
  }) {
    const options = omitBy({ name, email, category }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
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
};

module.exports = mongoose.model('Fleet', fleetSchema);

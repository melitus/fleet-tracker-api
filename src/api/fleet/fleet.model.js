const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const uuidv4 = require('uuid/v4');

// Fleet Categories
const categories = ["car", "truck"];

// Fleet Schema
 
const fleetSchema = new mongoose.Schema({
  fleetname: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  fleetinfo: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  contactname: {
      type: String,
      trim: true
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    mobile: {
      type: String,
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
 * Methods
 */
fleetSchema.method({
  
  transform() {
    const transformed = {};
    const fields = ['id','fleetname', 'fleetinfo', 'contactname', 'category','trackingnumber'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
fleetSchema.statics = {

  // Get fleet
   
  async get(id) {
    try {
      let fleet;

      if (mongoose.Types.ObjectId.isValid(id)) {
        fleet = await this.findById(id).exec();
      }
      if (fleet) {
        return fleet;
      }

      throw new APIError({
        message: 'fleet does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  // List fleets in descending order of 'createdAt' timestamp.

  list({
    page = 1,
    perPage = 30,
    fleetname,
    fleetinfo,
    contactname,
    category,
    trackingnumber,
  }) {
    const options = omitBy({  fleetname, fleetinfo,contactname, category, trackingnumber }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }, 
  
};

module.exports = mongoose.model('Fleet', fleetSchema);

const Joi = require('joi');
const Fleet = require('../models/fleet.model');

module.exports = {

  // GET /v1/Fleets
  listFleets: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      fleetname: Joi.string(),
      fleetinfo: Joi.string(),
      // category: Joi.string().valid(Fleet.categories),
    },
  },

  // POST /v1/Fleets
  createFleet: {
    body: {
      fleetname: Joi.string(),
      fleetinfo: Joi.string(),
      // category: Joi.string().valid(Fleet.categories),
    },
  },

  // PUT /v1/Fleets/:FleetId
  updateFleet: {
    body: {
      leetname: Joi.string(),
      fleetinfo: Joi.string(),
      // category: Joi.string().valid(Fleet.categories),
    },
    params: {
      fleetId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};

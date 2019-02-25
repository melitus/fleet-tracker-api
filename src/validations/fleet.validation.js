const Joi = require('joi');
const Fleet = require('../models/fleet.model');

module.exports = {

  // GET /v1/Fleets
  listFleets: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      category: Joi.string().valid(Fleet.categories),
    },
  },

  // POST /v1/Fleets
  createFleet: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      category: Joi.string().valid(Fleet.categories),
    },
  },

  // PUT /v1/Fleets/:FleetId
  replaceFleet: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      category: Joi.string().valid(Fleet.categories),
    },
    params: {
      fleetId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Fleets/:FleetId
  updateFleet: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      category: Joi.string().valid(Fleet.categories),
    },
    params: {
      fleetId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};

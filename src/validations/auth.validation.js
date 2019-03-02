const Joi = require('joi');

module.exports = {
  // POST /auth/register
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
      
    },
  },

  // POST /auth/login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128),
    },
  },
};

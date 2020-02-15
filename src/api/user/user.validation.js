const Joi = require('@hapi/joi')

const loginSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .trim()
    .required(),
  password: Joi.string()
    .required()
    .min(6)
    .max(128)
})

const registerSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .trim()
    .required(),
  role: Joi.any()
    // .valid(['customer', 'admin', 'visitor', 'seller'])
    .required(),
  username: Joi.string()
    .trim()
    .required(),
  password: Joi.string()
    .required()
    .min(6)
    .max(128)
})

const oAuthSchema = Joi.object().keys({
  access_token: Joi.string()
    .trim()
    .required()
})

module.exports = { loginSchema, registerSchema, oAuthSchema }

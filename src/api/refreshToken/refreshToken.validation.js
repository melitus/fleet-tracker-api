const Joi = require('@hapi/joi')

const refreshSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .trim()
    .required(),
  refreshToken: Joi.string().required()
})

module.exports = { refreshSchema }

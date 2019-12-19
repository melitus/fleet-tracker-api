const Joi = require('@hapi/joi')

const createFleet = Joi.object().keys({
    fleetname: Joi.string().trim().required(),
    fleetinfo: Joi.string().trim().required()
})


const updateFleet = Joi.object().keys({
  fleetname: Joi.string().trim().required(),
  fleetinfo: Joi.string().trim().required(),
  fleetId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),

})

module.exports = { createFleet, updateFleet }



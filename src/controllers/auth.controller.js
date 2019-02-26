const httpStatus = require('http-status');
const moment = require('moment-timezone');

const Fleet = require('../models/fleet.model');
const { appKey } = require("../config/credentials");


//Returns a formated object with tokens

function generateTokenResponse(fleet, accessToken) {
  const tokenType = 'Bearer';
  const expiresIn = moment().add(appKey.jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, fleet, expiresIn,
  };
}

module.exports = {

  register: async (req, res, next) => {
    try {
      const fleet = await (new Fleet(req.body)).save();
      const token = generateTokenResponse(fleet, fleet.token());
      res.status(httpStatus.CREATED);
      return res.json({ token ,fleet});
    } catch (error) {
      return next(Fleet.checkDuplicateEmail(error));
    }
  },

  login: async (req, res, next) => {
    try {
      const { fleet, accessToken } = await Fleet.findAndGenerateToken(req.body);
      const token = generateTokenResponse(fleet, accessToken);
      return res.json({ token,fleet });
    } catch (error) {
      return next(error);
    }
  }
};
const httpStatus = require('http-status');
const moment = require('moment-timezone');

const User = require('../models/user.model');
const { appKey } = require("../config/credentials");

//Returns a formated object with tokens

function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const expiresIn = moment().add(appKey.jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, user, expiresIn,
  };
}

module.exports = {

  register: async (req, res, next) => {
    try {
      const user = await (new User(req.body)).save();
      const token = generateTokenResponse(user, user.token());
      res.status(httpStatus.CREATED);
      return res.json({ token ,user});
    } catch (error) {
      return next(User.checkDuplicateEmail(error));
    }
  },

  login: async (req, res, next) => {
    try {
      const { user, accessToken } = await User.findAndGenerateToken(req.body);
      const token = generateTokenResponse(user, accessToken);
      return res.json({ token,user });
    } catch (error) {
      return next(error);
    }
  }
};
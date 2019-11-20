const httpStatus = require('http-status');
const moment = require('moment-timezone');

const User = require('../../models/user.model');
const { appKey, sendVerificationMail} = require("../../config/credentials");
const { sendVerificationEmail } = require('../../controllers/verification.controller');

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
      const userTransformed = user.transform();
      const token = generateTokenResponse(user, user.token());
      res.status(httpStatus.CREATED);
      if(sendVerificationMail) {
       sendVerificationEmail(user.uuid, { to: userTransformed.email });
      }
      return res.json({ token, user: userTransformed});
    } catch (error) {
      return next(User.checkDuplicateEmail(error));
    }
  },

  login: async (req, res, next) => {
    try {
      const { user, accessToken } = await User.findAndGenerateToken(req.body);
      const token = generateTokenResponse(user, accessToken);
      const userTransformed = user.transform();
      return res.json({ token, user: userTransformed  });
    } catch (error) {
      return next(error);
    }
  },
  oAuth: async (req, res, next) => {
    try {
      const { user } = req;
      const accessToken = user.token();
      const token = generateTokenResponse(user, accessToken);
      const userTransformed = user.transform();
      return res.json({ token, user: userTransformed });
    } catch (error) {
      return next(error);
    }
  },
};
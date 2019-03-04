const express = require('express');
const validate = require('express-validation');

const oAuthLogin = require('../middlewares/auth').oAuth;
const controller = require('../controllers/auth.controller');
const {
  login,
  register,
  oAuth,
} = require('../validations/auth.validation');

const router = express.Router();

// [POST] auth/register Register
router.route('/register')
  .post(validate(register), controller.register);

// auth/login Login
router.route('/login')
  .post(validate(login), controller.login);

//auth/facebook Facebook Login
router.route('/facebook')
  .post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);

// auth/google Google Login
router.route('/google')
  .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);


module.exports = router;

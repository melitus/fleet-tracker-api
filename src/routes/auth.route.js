const express = require('express');
const validate = require('express-validation');

const controller = require('../controllers/auth.controller');
const {
  login,
  register,
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


router.route('/facebook')
  .post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);

/**
 * @api {post} v1/auth/google Google Login
 * @apiDescription Login with google. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName GoogleLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Google's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accpessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router.route('/google')
  .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);
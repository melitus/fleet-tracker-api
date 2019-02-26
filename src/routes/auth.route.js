const express = require('express');
const validate = require('express-validation');

const controller = require('../controllers/auth.controller');
const {
  login,
  register,
} = require('../validations/auth.validation');
const {
  requireSignIn,
} = require('../middlewares/auth');

const router = express.Router();

// [POST] auth/register Register
router.route('/register')
  .post(validate(register), controller.register);

// auth/login Login
router.route('/login')
  .post(validate(login), controller.login);

module.exports = router;

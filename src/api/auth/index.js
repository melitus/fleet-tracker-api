const express = require('express')
const passport = require('passport')

const controller = require('./auth.controller')
const verifyCtl = require('./verification.controller')
const { loginSchema, registerSchema } = require('./auth.validation')
const { refreshSchema } = require('../refreshToken/refreshToken.validation')
const { loginLimiter } = require('../../middlewares/ratelimit')
const validate = require('../../middlewares/validation')

const requiresLocalAuth = passport.authenticate('local', { session: false })
const router = express.Router()

router.route('/emailexist').post(controller.isUserEmailExist)

router.route('/verifyemail/:uuid').get(verifyCtl.verifyUserEmail)

// [POST] auth/register Register
router
  .route('/register')
  .post(validate.validateBodySchema(registerSchema), controller.register)

// auth/login Login
router
  .route('/login')
  .post(
    validate.validateBodySchema(loginSchema),
    loginLimiter,
    requiresLocalAuth,
    controller.login
  )

router
  .route('/refresh-token')
  .post(validate.validateBodySchema(refreshSchema), controller.refresh)

router.route('/resend-email').post(controller.resendEmail)

module.exports = router

const express = require('express')
// const validate = require('express-validation')

const controller = require('./refreshToken.controller')
const { refreshSchema } = require('./refreshToken.validation')
const validate = require('../../middlewares/validation')

const router = express.Router()

// {post} v1/auth/refresh-token Refresh Token
router.route('/refresh-token').post(validate(refreshSchema), controller.refresh)

module.exports = router

const express = require('express');

const controller = require('../controllers/verification.controller');
const router = express.Router();

// verify/email/:uuid Verify email
 
router.route('/email/:uuid')
  .get(controller.verifyUserEmail);

router.route('/otp')
  .post(controller.verifyMobileOtp);

module.exports = router;
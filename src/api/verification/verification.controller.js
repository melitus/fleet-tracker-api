const sendMail = require('../../services/mail/mailer')
const User = require('../user/user.model')
const logger = require('../../config/logger').email
const {
  __mailerOptionsAcountVerification,
} = require('../../services/mail/mailOptionsBuilder')
const { sendSMS } = require('../../services/sms/AfricasTalkingGateway')
const OTPWrapper = require('../../services/otp/otpWrapper')

module.exports = {
  sendVerificationEmail: (hash, data, options, next) => {
    const mailerOptions = __mailerOptionsAcountVerification(hash, data, options)
    sendMail(mailerOptions, true, (error, result) => {
      if (error) {
        logger.error(error)
      } else {
        logger.info(result)
      }
    })
  },
  sendOtp: async (phoneNo, email) => {
    const otpCode = await OTPWrapper.generateOTPCode()
    const isoPhoneNo = await OTPWrapper.getISOPhoneNo(phoneNo)
    const smsOptions = {
      to: [isoPhoneNo],
      message: `Your verification code is ${otpCode}. This code expires in 3`
    }
    await sendSMS(smsOptions)
    const message = await User.findOneAndUpdate(email, { otp: otpCode })
    return message
  },

  verifyUserEmail: async (req, res, next) => {
    const { uuid } = req.params
    try {
      logger.info({ message: uuid })
      await User.verifyEmail(uuid)
      let url = `https://connetmi.com/kyc/login`
      return res.redirect(302, url)
    } catch (err) {
      logger.error({ err })
      return next({ err })
    }
  },

  verifyMobileOtp: async (req, res, next) => {
    const { otp } = req.body
    try {
      const message = await User.verifyMobileOtp(otp)
      return res.send(message)
    } catch (err) {
      return next(err)
    }
  }
}

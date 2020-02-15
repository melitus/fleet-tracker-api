const UserService = require( './user.service')

const {
  onFailure,
  onSuccess,
  onCreated,
  onNotFoundError
} = require( '../../responses')
const message = require( '../../messages/messages')
const {sendVerificationMail,} = require('../../config/credentials')
const {dispatch} = require('../../eventBus/eventBus')

const isUserEmailExist = async (req, res) => {
    try {
      const { email } = req.body
      req.body.email = String(req.body.email).toLowerCase(); // create a string

      const userEmailExist = await UserService.isUserEmailExist(email)
      if (userEmailExist) {
        onSuccess(res, email, message.email_available)
      } else {
        onSuccess(res, email, message.email_unavailable)
      }
    } catch (error) {
      onFailure(res, error, message.invalid_email)
    }
  }

  const register = async (req, res) => {
    try {
      const data = req.body
      const doesEmailExists = await UserService.isUserEmailExist(data.email)
      if (!doesEmailExists) {
        const registerUser = await UserService.register(data)
        onCreated(res, registerUser, message.signup_sucess)
      } else {
        if (sendVerificationMail) {
           dispatch('user_signup', savedUser.uuid, userTransformed, {
            to: userTransformed.email
          } )
        }
        onSuccess(res, data.email, message.email_available)
      }
    } catch (error) {
      onFailure(res, error, message.signup_failure)
    }
  }

 const login = async (req, res) => {
    try {
      const user = req.body
      const response = await UserService.login(user)
      if (user.role === 'customer') {
        return response
      } else if (!user.emailVerified) {
        onNotFoundError(res, user, message.verify_account)
      } else {
        return response
      }
    } catch (error) {
      onFailure(res, error, message.invalid_credentials)
    }
  }
  const resendEmail = async  (req, res) => {
    try {
      const { email } = req.body
      const savedUser = await UserService.resendEmail(email)
      if (savedUser) {
        onSuccess(res, savedUser, message.resend_email)
      }
    } catch (error) {
      onFailure(res, error, message.resend_email_failure)
    }
  }

  const getOTPCode = async  (req, res)=> {
    try {
      const data = req.body
      const response = await UserService.getOTPCode(data)
      if (response) {
        onSuccess(res, response, message.otp_success)
      }
    } catch (error) {
      onFailure(res, error, message.otp_failure)
    }
  }

  const verifyOTPCode = async  (req, res) => {
    try {
      const otpCode = req.body.otp
      let verifyMsg = ''
      let isOTPValid
      const otpVerified = await UserService.verifyOTPCode(otpCode)
      if (!otpVerified) {
        verifyMsg = `${otpCode} OTP code is valid `
        isOTPValid = true
      } else {
        verifyMsg = `${otpCode} OTP code is invalid`
        isOTPValid = false
      }
      onSuccess(
        res,
        { isOTPCodeValid: isOTPValid, verificationMsg: verifyMsg },
        message.otp_verify_success
      )
    } catch (e) {
      onFailure(res, e, message.otp_verify_failure)
    }
  }

  const getOTPTimeUsed =  (req, res) => {
    try {
      const otpTimeUsed = UserService.getOTPTimeUsed()
      let response = { success: true, otpTimeUsed: otpTimeUsed }
      onSuccess(res, response, message.otp_time_used)
    } catch (e) {
      onFailure(res, e, '')
    }
  }

 const getOTPTimeRemaining = (req, res) => {
    try {
      const otpTimeRemaining = UserService.getOTPTimeUsed()
      let response = { success: true, otpTimeRemaining: otpTimeRemaining }
      onSuccess(res, response, message.otp_time_remaining)
    } catch (e) {
      onFailure(res, e, '')
    }
  }

  const oAuth = async  (req, res) => {
    try {
      const response = await UserService.oAuth(req)
      onSuccess(res, response, message.oAuth_success)
    } catch (error) {
      onFailure(res, error, message.oAuth_failure)
    }
  }

  const refresh = async (req, res) => {
    try {
      const data = req.body
      const response = await UserService.refreshToken(data)
      onCreated(res, response, message.refresh_token_success)
    } catch (error) {
      onFailure(res, error, message.refresh_token_failure)
    }
  }

module.exports = {
  isUserEmailExist,
  register,
  login,
  resendEmail,
  getOTPCode,
  verifyOTPCode,
  getOTPTimeUsed,
  getOTPTimeRemaining,
  oAuth,
  refresh
}
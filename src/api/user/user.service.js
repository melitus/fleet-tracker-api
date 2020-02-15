const User = require('./user.model')
const OTPWrapper = require('../../services/otp/otpWrapper')
const { sendSMS } = require('../../services/sms/AfricasTalkingGateway')
const {
  resendEmailVerification
} = require('../verification/verification.controller')
const { dispatch } = require('../../eventBus/eventBus')
const {
  generateTokenResponse
} = require('../../policies/authstrategy/authmanager')

const RefreshToken = require('../refreshToken/refreshToken.model')

exports.checkUser = async email => {
  const user = await User.findOne(
    { email: email },
    { password: 0, createdAt: 0, updatedAt: 0 }
  ).exec()
  return user
}

exports.register = async userData => {
  const user = new User(userData)
  const savedUser = await user.save()
  const userTransformed = savedUser.transform()
  const token = generateTokenResponse(savedUser, savedUser.token())
  const response = { token: token, user: userTransformed }
  if (sendVerificationMail) {
    dispatch('user-signup', savedUser.uuid, userTransformed, {
      to: userTransformed.email
    })
  }
  return response
}

exports.login = async userData => {
  const { user, accessToken } = await User.findAndGenerateToken(userData)
  const token = generateTokenResponse(user, accessToken)
  const userTransformed = user.transform()
  const response = {
    data: userTransformed,
    token: token
  }
  return response
}

exports.logout = async req => {
  req.logout()
}

exports.resendEmail = async email => {
  const savedUser = await User.findOne({ email: email })
  if (resendEmailVerification) {
    dispatch('resend-email', savedUser.uuid, savedUser, {
      to: savedUser.email
    })
  }
  return savedUser
}

exports.getOTPCode = async data => {
  const { phoneNo, email } = data
  const otpCode = await OTPWrapper.generateOTPCode()
  const isoPhoneNo = await OTPWrapper.getISOPhoneNo(phoneNo)
  const smsOptions = {
    to: [isoPhoneNo],
    message: `Your verification code is ${otpCode}. This code expires in 3`
  }
  await sendSMS(smsOptions)
  const message = await User.findOneAndUpdate(email, { otp: otpCode })
  return message
}

exports.verifyOTPCode = async otpCode => {
  const otpVerified = await OTPWrapper.verifyOTPCode(otpCode)
  await User.verifyMobileOtp(otpCode)
  return otpVerified
}

exports.getOTPTimeUsed = () => {
  return OTPWrapper.getOTPtimeUsed()
}

exports.getOTPTimeRemaining = () => {
  return OTPWrapper.getOTPtimeRemaining()
}

exports.oAuth = async req => {
  const { user } = req
  const accessToken = user.token()
  const token = generateTokenResponse(user, accessToken)
  const userTransformed = user.transform()
  let response = { token, user: userTransformed }
  return response
}

exports.refreshToken = async data => {
  const { email, refreshToken } = data
  const refreshObject = await RefreshToken.findOneAndRemove({
    userEmail: email,
    token: refreshToken
  })
  const { user, accessToken } = await User.findAndGenerateToken({
    email,
    refreshObject
  })
  const response = generateTokenResponse(user, accessToken)
  return response
}

exports.isUserEmailExist = async email => {
  const userEmailExist = await User.findOne({ email })
    .select('-password')
    .exec()
  return userEmailExist
}

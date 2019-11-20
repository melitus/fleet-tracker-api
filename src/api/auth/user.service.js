import crypto from 'crypto'

import User from '../user/user.model'
import OTPWrapper from '../../services/otp/otpWrapper'
import { sendSMS } from '../../services/sms/AfricasTalkingGateway'
import { resendEmailVerification } from './verification.controller'
import { dispatch }from '../../eventBus/eventBus'
import configLoader from '../../config/config'
import { issueExpiresDate, generatePasswordHash, passwordMatches} from '../../policies/authstrategy/authmanager'

import RefreshToken from '../refreshToken/refreshToken.model'

export async function generateTokenResponse(user, accessToken) {
    const tokenType = 'Bearer'
    const refreshToken = await RefreshToken.generate(user).token
    return {
      tokenType,
      accessToken,
      refreshToken,
      issueExpiresDate
    }
  }

const config = configLoader.loadConfigAction()

// this token would be sent in the link to reset forgot password
const token = crypto.randomBytes(32).toString('hex')



// Login Action

export const checkUser = async email =>{
    const user = await User.findOne({ email: email }, { password: 0, createdAt: 0, updatedAt: 0 }).exec()
    return user
  }
  
  export const register = async userData => {
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
  
  export const login = async userData => {
    const { user, accessToken } = await User.findAndGenerateToken(userData)
    const token = generateTokenResponse(user, accessToken)
    const userTransformed = user.transform()
    const response = {
      data: userTransformed,
      token: token
    }
    return response
  }
  
  const logout = async (req) => {
    req.logout();
  }
  
  export const setLastPresentLogged = async userId=> {
    const getTodayDate = new Date()
    const user = await User.updateOne( {userId},
      { $set:{ last_present_logged: getTodayDate}}
    )
    return user
  }
  export const setLastLogin = async userId => {
    const getTodayDate = new Date()
    const user = await User.updateOne( {userId},
      { $set:{ lastLogin: getTodayDate}}
    )
    return user
  }
  
  export const resendEmail = async email => {
    const savedUser = await User.findOne({ email: email })
    if (resendEmailVerification) {
      dispatch('resend-email', savedUser.uuid, savedUser, {
        to: savedUser.email
      })
    }
    return savedUser
  }
  
  export const getOTPCode = async data => {
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
  
  export const verifyOTPCode = async otpCode => {
    const otpVerified = await OTPWrapper.verifyOTPCode(otpCode)
    await User.verifyMobileOtp(otpCode)
    return otpVerified
  }
  
  export const getOTPTimeUsed = () => {
    return OTPWrapper.getOTPtimeUsed()
  }
  
  export const getOTPTimeRemaining = () => {
    return OTPWrapper.getOTPtimeRemaining()
  }
  
  export const oAuth = async req => {
    const { user } = req
    const accessToken = user.token()
    const token = generateTokenResponse(user, accessToken)
    const userTransformed = user.transform()
    let response = { token, user: userTransformed }
    return response
  }
  
  export const refreshToken = async data => {
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
  
  export const forgotPassword = async data => {
    const { email } = data
    const user = await User.findOne({ email })
    user.passwordResetToken = token
    user.passwordResetExpires = issueExpiresDate // 15 minutes
    const savedUser = await user.save()
    const response = { token: token, user: savedUser }
    if (sendResetPasswordMail) {
      dispatch('reset-password', savedUser.uuid, savedUser, {
        to: savedUser.email
      })
    }
    return response
  }
  
  export const verifyPasswordResetToken = async params => {
    const { token } = params
    const userToken = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    })
    return userToken
  }
  
  export const resetPassword = async data => {
    const { password, userId } = data
    const user = await User.findById(userId).exec()
    const hashedPassword = await generatePasswordHash(password)
    const fieldToUpdate = { password: hashedPassword }
    await User.updateOne({ userId }, { $set: fieldToUpdate }, { new: true }).exec()
    return user
  }
  
  export const changePassword = async data => {
    const { userId, oldpassword, newpassword } = data
    const isUserExist = await User.findById(userId, { password: 1 }).exec()
    const userPassword = isUserExist.password
    const isPasswordCorrect = await passwordMatches(oldpassword, userPassword)
    const hashedPassword = await generatePasswordHash(newpassword)
    const fieldToUpdate = { password: hashedPassword }
    await User.updateOne({ userId }, { $set: fieldToUpdate }, { new: true }).exec()
    let response = {
      isUserExist,
      isPasswordCorrect
    }
    return response
  }
  export const isUserEmailExist = async email => {
    const userEmailExist = await User.findOne({ email })
      .select('-password')
      .exec()
    return userEmailExist
  }
  export const deactivateUserAccount = async userId => {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: false } },
      { fields: { _id: 0, isActive: 1 }, new: true }
    )
    return user
  }
  
  export const activateUserAccount = async userId => {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: true } },
      { fields: { _id: 0, isActive: 1 }, new: true }
    )
    return user
  }
 
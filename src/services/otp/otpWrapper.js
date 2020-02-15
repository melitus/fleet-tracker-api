const otplib = require('otplib')
const PhoneNumber = require('awesome-phonenumber')

const secret = otplib.authenticator.generateSecret()

// Configure otplib settings
otplib.authenticator.options = {
  step: 30,
  window: 0
}

let generateOTPCode = () => {
  return otplib.authenticator.generate(secret)
}

let verifyOTPCode = async token => {
  const verifyOTPCode = await authenticator.verify(token, secret)
  return verifyOTPCode
}

let getOTPtimeUsed = () => {
  return otplib.authenticator.timeUsed()
}

let getOTPtimeRemaining = () => {
  return otplib.authenticator.timeRemaining()
}

let isOTPExpired = () => {}

let isOTPCodeExpired = () => {
  if (this.getOTPtimeRemaining() === 0) return true
  return false
}

let getISOPhoneNo = number => {
  const phoneNumber = new PhoneNumber(number, 'NG')
  return phoneNumber.getNumber('e164')
}

module.exports = {
  generateOTPCode,
  verifyOTPCode,
  getOTPtimeUsed,
  getOTPtimeRemaining,
  isOTPExpired,
  isOTPCodeExpired,
  getISOPhoneNo
}

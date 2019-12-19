const moment = require( 'moment-timezone')
const bcrypt = require( 'bcryptjs')

const { appKey } = require( '../../config/credentials')
const RefreshToken = require( '../refreshToken/refreshToken.model')

let issueExpiresDate = moment().add(appKey.jwtExpirationInterval, 'minutes')


exports.generatePasswordHash = async (password) =>{
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

exports.passwordMatches = async (plainPassword, hashedPassword) => {
  let isPasswordEqual = await bcrypt.compare(plainPassword, hashedPassword)
  return isPasswordEqual
}

exports.generateTokenResponse = (user, accessToken) =>{
  const tokenType = 'Bearer'
  const refreshToken = RefreshToken.generate(user).token
  return {
    tokenType,
    accessToken,
    refreshToken,
    issueExpiresDate
  }
}

const speakeasy = require('speakeasy')

const secret = speakeasy.generateSecret({ length: 20 })

const generateOTPCode = () => {
  return speakeasy.totp({ secret: secret.base32, encoding: 'based32' })
}

const verifyOTPCode = token => {
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token,
    window: 0
  })
}

function getToken(secret) {
  return speakeasy.time({ secret: secret, encoding: 'base32' })
}

module.exports = {
  generateOTPCode,
  verifyOTPCode,
  getToken
}

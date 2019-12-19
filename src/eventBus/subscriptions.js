const { subscribe } = require('./eventNames')
const { sendVerificationEmail} = require('./verification.controller')

subscribe('user-registered', sendVerificationEmail(savedUser.uuid, userTransformed, {
    to: userTransformed.email
  }))

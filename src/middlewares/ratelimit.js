const rateLimit = require('express-rate-limit')

// this help to limit concurrent requests to prevent brute-force attacks
// if not set,it could result to denial of service or service un available
const minutes = 5
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 500, // limit each IP to 50 requests per windowMs
  delayMs: 0, // disabled
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      msg: `You made too many requests. Please try again after ${minutes} minutes.`
    })
  }
})

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 1 hour window
  max: 100, // start blocking after 3 requests
  delayMs: 0, // disabled
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      msg: `You made too many requests. Please try again after ${minutes} minutes.`
    })
  }
})

module.exports = { limiter, loginLimiter }

// app.post('/create-account', createAccountLimiter, function(req, res)

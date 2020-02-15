const mongoose = require('mongoose')
const httpStatus = require('http-status')
const bcrypt = require('bcryptjs')
const moment = require('moment-timezone')
const jwt = require('jwt-simple')
const uuidv4 = require('uuid/v4')

const APIError = require('../../utils/APIError')
const { appKey } = require('../../config/credentials')
const {
  generatePasswordHash
} = require('../../policies/authstrategy/authmanager')

// User Roles
const roles = ['user', 'admin']

// User Schema

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      unique: true,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true
    },
    services: {
      facebook: String,
      google: String
    },
    role: {
      type: String,
      enum: roles,
      default: 'user'
    },
    mobile: {
      type: String,
      trim: true
    },
    uuid: {
      type: String,
      default: uuidv4()
    },
    otp: {
      type: Number
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    mobileVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next()

    const hash = await generatePasswordHash(this.password)
    this.password = hash

    return next()
  } catch (error) {
    return next(error)
  }
})

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {}
    const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt']

    fields.forEach(field => {
      transformed[field] = this[field]
    })

    return transformed
  },
  token() {
    const playload = {
      exp: moment()
        .add(appKey.jwtExpirationInterval, 'minutes')
        .unix(),
      iat: moment().unix(),
      sub: this._id
    }
    return jwt.encode(playload, appKey.jwtSecret)
  }
})

/**
 * Statics
 */
userSchema.statics = {
  async findAndGenerateToken(options) {
    const { email, password } = options
    if (!email)
      throw new APIError({
        message: 'An email is required to generate a token'
      })

    const user = await this.findOne({ email }).exec()
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    }
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() }
      }
      err.message = 'Incorrect email or password'
    } else {
      err.message = 'Incorrect email'
    }
    throw new APIError(err)
  },

  async verifyEmail(uuid) {
    if (!uuid)
      throw new APIError({ message: 'No token found for verification' })
    try {
      const user = await this.findOneAndUpdate(
        { uuid },
        { emailVerified: true }
      ).exec()

      if (user) {
        return { message: 'Thank you for verification' }
      }
      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND
      })
    } catch (err) {
      throw new APIError(err)
    }
  },

  async verifyMobileOtp(email, otp) {
    if (!email || !otp)
      throw new APIError({
        message: 'Can not verify otp due to insufficient information',
        status: httpStatus.BAD_REQUEST
      })

    try {
      const user = await this.findOne({ email, otp }).exec()
      if (user) {
        return { message: 'OTP verified' }
      }
      throw new APIError({
        message: 'OTP did not match',
        status: httpStatus.NOT_FOUND
      })
    } catch (err) {
      throw new APIError(err)
    }
  },
  async FindOneAndUpdate(query, update) {
    try {
      const user = await this.findOneAndUpdate(query, update).exec()
      if (user) {
        return user
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND
      })
    } catch (err) {
      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.BAD_REQUEST
      })
    }
  }
}

module.exports = mongoose.model('user', userSchema)

const mongoose = require('mongoose')
const logger = require('../config/logger').db

const config = require('../config/credentials')

// make bluebird default Promise
mongoose.Promise = require('bluebird')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('debugger', true)

if (config.env === 'dev') {
  mongoose.set('debug', true)
}

exports.connectMongoWithRetry = async () => {
  let mongoURI = config.mongo.uri
  let options = config.mongo.options

  await mongoose.connect(mongoURI, options)
  logger.info('Mongoose successfully connected to Conetmi database: ')
  return mongoose.connection
}

function gracefulShutdown(signal) {
  logger.info(`Received ${signal}. Shutting down.`)
  try {
    clearTimeout(timeout)
    mongoose.connection.close()
  } catch (err) {
    logger.error(`Failure during Conductor worker shutdown: ${err.message}`)
    process.exit(1)
  }
  process.exit(0)
}

function failure(reason, err) {
  logger.error(
    `Unhandled ${reason}: ${err.stack}. Shutting down Conductor worker.`
  )
  try {
    clearTimeout(timeout)
    mongoose.connection.close()
  } catch (err) {
    logger.error(`Failure during Conductor worker shutdown: ${err.message}`)
  }
  process.exit(1)
}

process.once('SIGUSR2', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('unhandledRejection', failure.bind(null, 'promise rejection'))
process.on('uncaughtException', failure.bind(null, 'exception'))

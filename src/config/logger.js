const { createLogger, format, transports } = require('winston')
const chalk = require('chalk').default

const { combine, colorize, label, printf, splat, timestamp } = format

const myFormat = printf(
  info =>
    `${info.timestamp} ${chalk.cyan(info.label)} ${info.level}: ${info.message}`
)

const logFormat = loggerLabel =>
  combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    splat(),
    colorize(),
    label({ label: loggerLabel }),
    myFormat
  )

const createLoggerWithLabel = label =>
  createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
      new transports.Console({
        colorize: true,
        timestamp: myFormat,
        handleExceptions: true,
        humanReadableUnhandledException: true
      })
    ],
    format: logFormat(label)
  })

if (process.env.NODE_ENV !== 'production') {
  createLoggerWithLabel().add(
    new transports.Console({
      format: combine(
        colorize(),
        label({ label: 'Conetmi API' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
      )
    })
  )
}
module.exports.stream = {
  write: function(message) {
    createLoggerWithLabel().info(message.slice(0, -1))
  }
}

module.exports = {
  gateway: createLoggerWithLabel('[FLEETAPI:gateway]'),
  policy: createLoggerWithLabel('[FLEETAPI:policy]'),
  config: createLoggerWithLabel('[FLEETAPI:config]'),
  db: createLoggerWithLabel('[FLEETAPI:db]'),
  admin: createLoggerWithLabel('[FLEETAPI:admin]'),
  middleware: createLoggerWithLabel('[FLEETAPI:middleware]'),
  email: createLoggerWithLabel('[FLEETAPI:email]'),
  createLoggerWithLabel
}

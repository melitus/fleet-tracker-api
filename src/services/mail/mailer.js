/* eslint-disable prefer-promise-reject-errors */
const nodemailer = require('nodemailer')
const logger = require('../../config/logger').config
const credential = require('../../config/credentials')

const smtpFromEmailConfig = credential.email

const getSmtp = () => {
  const smtp = smtpFromEmailConfig

  return smtp
}

const sendMail = (smtp, message) => {
  return new Promise((resolve, reject) => {
    if (!message.to.includes('@')) {
      reject('Invalid email address')
      return
    }
    const transporter = nodemailer.createTransport(smtp)
    transporter.sendMail(message, (err, info) => {
      if (err) {
        reject(err)
      } else {
        resolve(info)
      }
    })
  })
}

const send = async message => {
  const smtp = getSmtp()
  try {
    const result = await sendMail(smtp, message)
    logger.info('Email sent', result)
    return true
  } catch (e) {
    logger.error('Email send failed', e)
    console.log({ e })
    return false
  }
}

module.exports = send

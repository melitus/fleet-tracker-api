const mjml2html = require('mjml')

const credentials = require('../../config/credentials')
const registrationTemplate = require('../../templates/email/accountverification')

const client = require('../../config/client')
const msgs = require('../../messages/messages')

const __mailerOptionsAcountVerification = (hash, data, options) => {
  // const companyLogo = client.logoUrl
  const name = `${data.username}`
  const verificationUrl = `${client.baseUrl}${
    client.verifyEmail
  }/${encodeURIComponent(hash)}`
  const template = registrationTemplate(name, verificationUrl)

  const html = mjml2html(template)
  const mailOptions = options
  mailOptions['html'] = html.html
  mailOptions['text'] = msgs.text
  mailOptions['from'] = credentials.email.auth.user
  mailOptions['subject'] = msgs.subject

  return mailOptions
}

module.exports = {
  __mailerOptionsAcountVerification
}

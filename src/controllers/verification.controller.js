const mjml2html = require('mjml');

const credentials = require('../config/credentials');
const registrationTemplate = require('../templates/email/registration');
const client = require('../config/client');
const sendMail = require("../services/mailer");
const User = require('../models/user.model');
const msgs = require('../messages/email.msgs');

const __mailerOptions = (hash, options) => {
  const companyLogo = client.logoUrl;
  const verificationUrl = `${client.baseUrl}${client.verifyEmail}/${hash}`;
  const template = registrationTemplate(companyLogo, verificationUrl);
  const html = mjml2html(template);

  const mailOptions = options;
  mailOptions['html'] = html.html;
  mailOptions['text'] = msgs.text;
  mailOptions['from'] = credentials.email.auth.user;
  mailOptions['subject'] = msgs.subject;

  return mailOptions;
}
module.exports = {

  sendVerificationEmail: (hash, options, next) => {
    const mailerOptions = __mailerOptions(hash, options);
       sendMail(mailerOptions, true, (error, result) =>{
        if (error) {
          console.error(error);
        } else {
          console.info(result);
        }
       })
  },
  verifyUserEmail: async (req, res, next) => {
    const { uuid } = req.params;
    try {
      const message = await User.verifyEmail(uuid);
      return res.send(message);
    } catch (err) {
      return next(err);
    }
  },
};



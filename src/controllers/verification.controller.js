const mjml2html = require('mjml');

const credentials = require('../config/credentials');
const registrationTemplate = require('../templates/email/registration');
const client = require('../config/client');
const mail = require("../services/mailer");
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

exports.sendVerificationEmail = async (hash, options, next) => {
  const mailerOptions = __mailerOptions(hash, options);
  try {
    const result = await mail.send(mailerOptions)
    return res.send(result);
  } catch (err) {
    return next(err);
  }
}

exports.verifyUserEmail = async (req, res, next) => {
  const { uuid } = req.params;

  try {
    const message = await User.verifyEmail(uuid);
    return res.send(message);
  } catch (err) {
    return next(err);
  }
}

exports.verifyMobileOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const message = await User.verifyMobileOtp(email, otp);
    return res.send(message);
  } catch (err) {
    return next(err);
  }
}


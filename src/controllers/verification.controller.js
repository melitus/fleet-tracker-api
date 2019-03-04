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
// let mailOptions = {
//     from: '"KB 👻" <test@kb.com>', // sender address
//     to: 'melitus.aroh@gmail.com', // list of receivers
//     subject: 'Node Contact Request', // Subject line
//     text: 'Hello world?', // plain text body
//     html: `<p>welcomee</p>` // html body
// };
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

// app.post('/send', (req, res) => {
//   const { name, address, subject, text } = req.body;
//   let mailOptions = {
//     from: `${name} <${address}>`,
//     to: 'sereymorm@gmail.com',
//     subject: subject,
//     text: `Message from: ${address}, ${text}`, 
//   };
//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           res.send(error);
//       }
//       res.send(`Successfully sent mail`);
//   });
// });
// // Mail configuration
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'some-email@gmail.com',
//     pass: 'email-password-here'
//   }
// })

// const nodemailer = require('nodemailer');
// let transporter = nodemailer.createTransport({
//     host: 'mail.domain.com',
//     port: 25,
//     secure: false,
//     auth: {
//         user: 'username@domain.com',
//         pass: 'password'
//     },
//     tls: { rejectUnauthorized: false }
// });
// transporter.verify(function (error, success) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Server is ready to take our messages');
//     }
// });


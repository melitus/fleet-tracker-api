const winston = require('winston');
const nodemailer = require('nodemailer');

const  credential = require("../config/credentials")

const smtpFromEmailConfig = credential.email;

const getSmtp = () => {
	const smtp = smtpFromEmailConfig;

	return smtp;
};

const sendMail = (smtp, message) => {    
	return new Promise((resolve, reject) => {
		if (!message.to.includes('@')) {
			reject('Invalid email address');
			return;
		}
		const transporter = nodemailer.createTransport(smtp);
		transporter.sendMail(message, (err, info) => {
			if (err) {
				reject(err);
			} else {
				resolve(info);
			}
		});
	});
};
const send = async message => {
	const smtp = getSmtp();
	try {
		const result = await sendMail(smtp, message);
		winston.info('Email sent', result);
		return true;
	} catch (e) {
		winston.error('Email send failed', e);
		return false;
	}
};

module.exports = send;
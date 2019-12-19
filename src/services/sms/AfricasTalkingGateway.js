const AfricasTalking = require('africastalking')

const config = require('../../config/credentials')

const options = {
  apiKey: config.sms.api_key,
  username: config.sms.username,
  format: config.sms.format
}

// Init africastalking
const africasTalking = new AfricasTalking(options, { debug: true })

const sms = africasTalking.SMS

let sendSMS = async options => {
  console.log({ options })
  const sentMessage = await sms.send(options)
  console.log({ sentMessage })
  return sentMessage
}
let reSendSMS = options => {
  return sms.send(options)
}

module.exports = {
  sendSMS,
  reSendSMS
}

// function sendSMS(url, apiKey, username, sender, messagetext, flash, recipients) {

//   var mainphoneNumber = "234" + recipients.replace(/^0+/, '');

//   console.log("Token Recipient " + mainphoneNumber);
//   var request = require('request');
//   request('http://api.ebulksms.com:8080/sendsms?username=richomoro@yahoo.com&apikey=d49c5155313577e7c17ef59ce87cbace4f63a239&sender=c-switch&messagetext=' + messagetext + '&flash=0&recipients=' + mainphoneNumber, function(error, response, body) {
//       console.log('error:', error); // Print the error if one occurred
//       console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//       console.log('body:', body); // Print the HTML for the Google homepage.
//   }).

// var request = require('request');

// module.exports = {
//   sendSMS: function(url, apiKey, username, sender, messagetext, flash, recipients) {
//     var propertiesObject = {
//       apiKey: apiKey,
//       username: username,
//       sender: sender,
//       messagetext: messagetext,
//       flash: flash,
//       recipients: recipients,
//     };

//     request({ url: url, qs: propertiesObject }, function(err, response, body) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       console.log('Get response: ' + response.statusCode);
//     });
//   },
// };
